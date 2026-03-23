import os
import shutil
from pathlib import Path
from typing import Optional

from fastapi import UploadFile

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


class FileStorageService:
    @staticmethod
    def save_file(file: UploadFile, filename: str) -> str:
        """Save uploaded file and return relative path."""
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return str(file_path)

    @staticmethod
    def get_file_path(file_path: str) -> Optional[Path]:
        """Get absolute path to file if exists."""
        path = Path(file_path)
        if path.exists() and path.is_file():
            return path
        return None

    @staticmethod
    def delete_file(file_path: str) -> bool:
        """Delete file if exists."""
        path = Path(file_path)
        if path.exists():
            path.unlink()
            return True
        return False

    @staticmethod
    def validate_file(file: UploadFile) -> bool:
        """Validate file type and size."""
        allowed_types = ["application/pdf"]
        max_size = 10 * 1024 * 1024  # 10MB

        if file.content_type not in allowed_types:
            return False
        if file.size and file.size > max_size:
            return False
        return True