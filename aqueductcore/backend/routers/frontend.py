"""Router for handling experiment files."""

from typing import Any

from fastapi import HTTPException, status
from fastapi.staticfiles import StaticFiles
from starlette.datastructures import Headers
from starlette.exceptions import HTTPException as StarletteHTTPException


class SPAStaticFiles(StaticFiles):
    """Static file router for single page application."""

    def __init__(self, *args: Any, **kwargs: Any):
        self.cachecontrol = "max-age=0, no-cache, no-store, , must-revalidate"
        self.pragma = "no-cache"
        self.expires = "0"
        super().__init__(*args, **kwargs)

    async def get_response(self, path: str, scope):
        """Returns file response if the path exists, otherwise returns `index.html`."""
        try:
            response = await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as error:
            if error.status_code == status.HTTP_404_NOT_FOUND:
                response = await super().get_response("index.html", scope)
            else:
                raise error
        response.headers.setdefault("Cache-Control", self.cachecontrol)
        response.headers.setdefault("Pragma", self.pragma)
        response.headers.setdefault("Expires", self.expires)

        return response

    def is_not_modified(self, response_headers: Headers, request_headers: Headers) -> bool:
        """Disable checking file modification to remove the cache."""
        return False
