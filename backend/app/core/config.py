import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "JomiTech (জমিটেক) Land Record Intelligence"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./jomitech.db")
    
    # Security & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "jomitech-super-secure-dev-secret-key-landtech2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Cryptographic integrity key ID
    ACTIVE_KEY_ID: str = "ed25519-jomitech-2026-v1"
    
    # Document storage
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./storage/documents")
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024 # 10 MB
    ALLOWED_MIME_TYPES: List[str] = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/tiff",
        "image/webp"
    ]
    
    # Demo environment
    DEMO_MODE: bool = True
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
