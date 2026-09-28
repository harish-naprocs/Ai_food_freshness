from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import freshness, storage
import os

app = FastAPI(title="Food Freshness Monitoring Platform API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup static files for uploaded images
UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

# Include Routers
app.include_router(freshness.router, prefix="/api/v1/freshness", tags=["Freshness"])
app.include_router(storage.router, prefix="/api/v1/storage", tags=["Storage"])

@app.get("/")
def root():
    return {"message": "Welcome to the Food Freshness Monitoring Platform API"}
