"""Configuration loading module for the web server."""

from __future__ import annotations

from typing import Optional

from pydantic import DirectoryPath, HttpUrl, NonNegativeInt, PositiveInt
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Settings provider class that reads the configuration from environment."""

    experiments_dir_path: DirectoryPath
    """Experiments' directory for download/upload."""

    min_gzip_compression_size_KB: NonNegativeInt = 0
    """Minimum HTTP response size to compress via GZip in KBs.
    Set value to 0 to disable gzip compression."""
    download_chunk_size_KB: PositiveInt = 1024
    """Chunk size for downloading a file in KBs."""
    upload_max_file_size_KB: PositiveInt = 1024 * 1024 * 4  # 4GB
    """Upload max file size in KBs."""
    upload_RAM_buffer_size_KB: PositiveInt = 1024 * 1  # 1MB
    """Upload buffer size in RAM before saving to storage in KBs."""

    postgres_username: str
    """PostgreSQL username."""
    postgres_password: str
    """PostgreSQL password."""
    postgres_host: str
    """PostgreSQL hostname."""
    postgres_port: int
    """PostgreSQL port."""
    postgres_db: str
    """PostgreSQL database name."""

    api_prefix: str = "/api"
    """Route prefix for all of the APIs."""

    files_route_prefix: str = "/files"
    """Route prefix for downloading files."""

    default_username: str = "admin"
    """Default username for the User"""

    keycloak_url: Optional[HttpUrl] = None
    """Keycloak OIDC URL (used in Aqueduct Pro only)."""

    keycloak_client_id: Optional[str] = None
    """Keycloak client ID (used in Aqueduct Pro only)"""

    extensions_dir_path: Optional[str] = None
    """Name of the directory where extensions are saved"""

settings = Settings()
