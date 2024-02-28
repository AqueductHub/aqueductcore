"""Router for handling experiment files."""

import os
from tempfile import TemporaryDirectory
from uuid import UUID

import pathvalidate
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import FileResponse, JSONResponse
from streaming_form_data import StreamingFormDataParser
from streaming_form_data.targets import FileTarget
from streaming_form_data.validators import MaxSizeValidator, ValidationError
from typing_extensions import Annotated

from aqueductcore.backend.server.context import ServerContext, context_dependency
from aqueductcore.backend.server.errors import (
    ECSDBExperimentNonExisting,
    ECSMaxBodySizeException,
)
from aqueductcore.backend.services.experiment import (
    build_experiment_dir_absolute_path,
    get_experiment_by_uuid,
)
from aqueductcore.backend.settings import settings

router = APIRouter()


@router.get("/{experiment_id}/{file_name}")
async def download_experiment_file(
    experiment_id: UUID,
    file_name: str,
    context: Annotated[ServerContext, Depends(context_dependency)],
) -> FileResponse:
    """Router for downloading files of experiments."""

    try:
        pathvalidate.validate_filename(file_name)
        # check if experiment exists with the specified ID, otherwise raises an exception.
        await get_experiment_by_uuid(db_session=context.db_session, experiment_id=experiment_id)
        experiment_dir = build_experiment_dir_absolute_path(
            str(settings.experiments_dir_path), experiment_id
        )
        file_path = os.path.join(experiment_dir, file_name)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="The requested file is not found.")

        response = FileResponse(file_path, stat_result=os.stat(file_path))
        response.chunk_size = settings.download_chunk_size_KB * 1024

    except ECSDBExperimentNonExisting as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The specified experiment was not found.",
        ) from error

    except pathvalidate.ValidationError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file name.",
        ) from error

    return response


class MaxBodySizeValidator:
    """Max body size validator.

    Args:
        max_size: Maximum number of bytes before raising exception.

    """

    def __init__(self, max_size: int):
        self.body_len = 0
        self.max_size = max_size

    def __call__(self, chunk: bytes):
        """Check the size of data streamed so far.
        Raises an exception when number of bytes exceeds the maximum.

        Args:
            chunk: New bytes received.

        """
        self.body_len += len(chunk)
        if self.body_len > self.max_size:
            raise ECSMaxBodySizeException(body_len=self.body_len)


@router.post("/{experiment_id}")
async def upload_experiment_file(
    request: Request,
    experiment_id: UUID,
    context: Annotated[ServerContext, Depends(context_dependency)],
) -> JSONResponse:
    """Router for uploading files to an experiment."""

    file_name = request.headers.get("file_name")

    if file_name is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Filename header is missing."
        )

    max_file_size = settings.upload_max_file_size_KB * 1024
    # extra space (1KB) for other headers
    max_body_size = max_file_size + 1024

    try:
        pathvalidate.validate_filename(file_name)
        # check if experiment exists with the specified ID, otherwise raises an exception.
        await get_experiment_by_uuid(db_session=context.db_session, experiment_id=experiment_id)
        experiment_dir = build_experiment_dir_absolute_path(
            str(settings.experiments_dir_path), experiment_id
        )

        # create experiment directory if it is its first file
        if not os.path.exists(experiment_dir):
            os.makedirs(experiment_dir)

        with TemporaryDirectory(dir=experiment_dir) as tmpdirname:
            dest_file_path = os.path.join(experiment_dir, file_name)

            temp_file_path = os.path.join(tmpdirname, file_name)
            file_target = FileTarget(
                filename=temp_file_path,
                validator=MaxSizeValidator(max_file_size),
            )

            body_validator = MaxBodySizeValidator(max_body_size)
            parser = StreamingFormDataParser(headers=request.headers)
            parser.register("file", file_target)

            max_buffer_size = settings.upload_RAM_buffer_size_KB * 1024
            upload_buffer = bytearray(max_buffer_size)
            buffer_counter = 0

            async for chunk in request.stream():
                body_validator(chunk=chunk)
                chunk_len = len(chunk)

                if buffer_counter + len(chunk) > max_buffer_size:
                    parser.data_received(bytes(upload_buffer[0:buffer_counter]))
                    buffer_counter = 0

                upload_buffer[buffer_counter : buffer_counter + chunk_len] = chunk
                buffer_counter += chunk_len

            # save last chunk in the buffer
            if buffer_counter != 0:
                parser.data_received(bytes(upload_buffer[0:buffer_counter]))
                buffer_counter = 0

            # On POSIX systems, file replacing happens very fast,
            # due to native system call, no need for threading.
            if not os.path.exists(temp_file_path):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The file is not sent correctly.",
                )
            os.replace(temp_file_path, dest_file_path)

    except ECSMaxBodySizeException as error:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Maximum request body size limit ({max_body_size} bytes) \
                exceeded ({error.body_len} bytes read).",
        ) from error
    except ValidationError as error:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Maximum file size limit ({max_file_size} bytes) exceeded.",
        ) from error
    except ECSDBExperimentNonExisting as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The specified experiment was not found.",
        ) from error

    except pathvalidate.ValidationError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file name.",
        ) from error

    return JSONResponse({"result": f"Successfuly uploaded {file_name}"})
