from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:pass@localhost/db"
    QDRANT_URL: str = "https://cloud.qdrant.io"
    QDRANT_API_KEY: str = "api_key"
    GEMINI_API_KEY: str = "api_key"

    class Config:
        env_file = ".env"

settings = Settings()
