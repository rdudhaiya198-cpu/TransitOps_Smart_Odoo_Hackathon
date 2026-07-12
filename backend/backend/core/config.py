import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TransitOps API"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", "transitops.db")

    class Config:
        env_file = ".env"

settings = Settings()

