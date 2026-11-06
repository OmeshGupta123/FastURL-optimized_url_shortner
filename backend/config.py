from pydantic_settings import BaseSettings
from pydantic import ConfigDict, Field
from typing import Optional
import os


class Settings(BaseSettings):
    database_url_env: Optional[str] = Field(default=None, validation_alias="DATABASE_URL")
    database_hostname: str = "localhost"
    database_port: str = "5432"
    database_password: str = ""
    database_name: str = "fasturl_db"
    database_username: str = "postgres"
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    redis_url: Optional[str] = Field(default=None, validation_alias="REDIS_URL")
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: str = ""
    
    # Cloud / environment
    environment: str = "development"  # development, production

    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"
    )

    @property
    def is_production(self) -> bool:
        return self.environment == "production"
    
    @property
    def database_url(self) -> str:
        # If full connection string is provided directly (e.g. Neon, Supabase, Render, Railway)
        if self.database_url_env:
            url = self.database_url_env.strip()
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)

            # If postgresql+psycopg:// is supplied but psycopg 3 is not installed, fallback to psycopg2
            if url.startswith("postgresql+psycopg://"):
                try:
                    import psycopg  # noqa: F401
                except ImportError:
                    url = url.replace("postgresql+psycopg://", "postgresql+psycopg2://", 1)

            return url

        if self.database_hostname.startswith("/"):
            # Direct Unix socket path provided
            return f"postgresql://{self.database_username}:{self.database_password}@/{self.database_name}?host={self.database_hostname}"
        else:
            # Use TCP for local/development
            return f"postgresql://{self.database_username}:{self.database_password}@{self.database_hostname}:{self.database_port}/{self.database_name}"


settings = Settings()