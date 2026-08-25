from pydantic_settings import BaseSettings
from typing import List
from enum import Enum

class EnvironmentType(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"

class Settings(BaseSettings):
    # Application Config
    APP_TITLE: str = "SIIDSTARC Backend"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: EnvironmentType = EnvironmentType.DEVELOPMENT
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    ENABLE_DOCS: bool = True

    # Database & Authentication Config
    MYSQL_URL: str = "sqlite+pysqlite:///./test.db"
    JWT_SECRET: str = "production-jwt-secret-change-in-env"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 Hours

    # CORS & Security Config
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "https://*.vercel.app"
    ]
    RATE_LIMIT_PER_MINUTE: int = 120

    # Optional Observability & Caching Infrastructure
    REDIS_URL: str = ""
    SENTRY_DSN: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
