import io
from datetime import timedelta
from typing import Optional

from fastapi import UploadFile
from minio import Minio
from minio.error import S3Error

from app.core.config import settings


class FileStorageService:
    def __init__(self):
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE,
        )
        self.bucket_name = settings.MINIO_BUCKET_NAME
        self._ensure_bucket_exists()

    def _ensure_bucket_exists(self):
        """Create bucket if it doesn't exist."""
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)
        except S3Error as e:
            raise Exception(f"MinIO bucket error: {e}")

    def save_file(self, file: UploadFile, filename: str) -> str:
        """Save uploaded file to MinIO and return object name."""
        try:
            # Read file content
            file_content = file.file.read()
            file_size = len(file_content)
            file.file.seek(0)  # Reset file pointer

            # Upload to MinIO
            self.client.put_object(
                self.bucket_name,
                filename,
                io.BytesIO(file_content),
                file_size,
                content_type=file.content_type,
            )
            return filename
        except S3Error as e:
            raise Exception(f"Failed to save file to MinIO: {e}")

    def get_file_url(self, object_name: str, expires: int = 3600) -> Optional[str]:
        """Get presigned URL for file download."""
        try:
            url = self.client.presigned_get_object(
                self.bucket_name, object_name, expires=timedelta(seconds=expires)
            )
            return url
        except S3Error:
            return None

    def get_file_content(self, object_name: str) -> Optional[bytes]:
        """Get file content from MinIO."""
        try:
            response = self.client.get_object(self.bucket_name, object_name)
            return response.read()
        except S3Error:
            return None
        finally:
            if 'response' in locals():
                response.close()
                response.release_conn()

    def delete_file(self, object_name: str) -> bool:
        """Delete file from MinIO."""
        try:
            self.client.remove_object(self.bucket_name, object_name)
            return True
        except S3Error:
            return False

    def validate_file(self, file: UploadFile) -> bool:
        """Validate file type and size."""
        allowed_types = ["application/pdf"]
        max_size = 10 * 1024 * 1024  # 10MB

        if file.content_type not in allowed_types:
            return False
        if file.size and file.size > max_size:
            return False
        return True


# Singleton instance
file_storage = FileStorageService()