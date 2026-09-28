from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Food Freshness Monitoring Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-key-for-local-dev-only"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = ""

    class Config:
        env_file = "../.env"

settings = Settings()
