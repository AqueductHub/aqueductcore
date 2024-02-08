"""Router for handling experiment files."""


from fastapi import HTTPException, status
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException


class SPAStaticFiles(StaticFiles):
    """Static file router for single page application."""

    async def get_response(self, path: str, scope):
        """Returns file response if the path exists, otherwise returns `index.html`."""
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as error:
            if error.status_code == status.HTTP_404_NOT_FOUND:
                return await super().get_response("index.html", scope)

            raise error
