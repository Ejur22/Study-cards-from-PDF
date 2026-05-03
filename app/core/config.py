import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_123")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60
    DATABASE_URL = os.getenv(
        "DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/smartcards"
    )

    # MinIO settings
    MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
    MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
    MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
    MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "pdf-files")
    MINIO_SECURE = os.getenv("MINIO_SECURE", "False").lower() == "true"


settings = Settings()
