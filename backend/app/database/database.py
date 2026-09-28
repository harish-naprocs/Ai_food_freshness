from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(settings.DATABASE_URL)

def get_db():
    yield client["food_freshness"]
