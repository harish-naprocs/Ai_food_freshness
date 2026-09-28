from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from pymongo.database import Database
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
import uuid

from app.database.database import get_db
from app.services.inference import freshness_model
from app.services.shelf_life import shelf_life_service

router = APIRouter()

# Setup upload directory
UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class FreshnessAssessmentResponse(BaseModel):
    id: str
    classification: str
    confidence: float
    freshness_score: float
    spoilage_status: str
    analyzed_at: str
    model_version: str
    product_id: Optional[int] = None
    batch_id: Optional[int] = None
    estimated_shelf_life_days: int
    recommendation: str

class AnalysisHistoryItem(BaseModel):
    id: str
    classification: str
    confidence: float
    freshness_score: float
    analyzed_at: str
    image_url: str
    estimated_shelf_life_days: int
    recommendation: str

@router.post("/analyze", response_model=FreshnessAssessmentResponse)
async def analyze_food_image(
    file: UploadFile = File(...),
    product_id: Optional[int] = Form(None),
    batch_id: Optional[int] = Form(None),
    db: Database = Depends(get_db),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    try:
        image_bytes = await file.read()
        
        # Save image locally
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as f:
            f.write(image_bytes)

        # 1. AI Image Analysis
        result = freshness_model.predict(image_bytes)
        
        # 2. Freshness Score calculation (Image-based provisional score for M2)
        base_scores = {
            "Fresh": 95,
            "Good": 80,
            "Acceptable": 60,
            "Near Spoilage": 40,
            "Spoiled": 10
        }
        
        score_base = base_scores.get(result["classification"], 50)
        final_score = score_base * result["confidence"]
        
        # 3. Create db records
        db_image_dict = {
            "file_path": unique_filename,
            "original_filename": file.filename,
            "content_type": file.content_type,
            "image_size": len(image_bytes),
            "product_id": product_id,
            "batch_id": batch_id,
            "uploaded_by": 1
        }
        image_result = db.food_images.insert_one(db_image_dict)
        
        # M3: Shelf Life Prediction & Recommendation
        product_map = {1: "Tomatoes", 2: "Apples", 3: "Bananas", 4: "Spinach"}
        product_name = product_map.get(product_id, "Default")
        shelf_life_data = shelf_life_service.predict(product_name, final_score, result["classification"])
        
        db_analysis_dict = {
            "food_image_id": str(image_result.inserted_id),
            "image_path": unique_filename,
            "model_version": result["model_version"],
            "predicted_class": result["classification"],
            "confidence": round(result["confidence"] * 100, 2),
            "freshness_score": round(final_score, 1),
            "spoilage_status": result["spoilage_status"],
            "estimated_shelf_life_days": shelf_life_data["estimated_shelf_life_days"],
            "recommendation": shelf_life_data["recommendation"],
            "analysis_timestamp": datetime.utcnow()
        }
        analysis_result = db.freshness_analyses.insert_one(db_analysis_dict)

        # 4. Assessment packaging
        assessment = FreshnessAssessmentResponse(
            id=str(analysis_result.inserted_id),
            classification=db_analysis_dict["predicted_class"],
            confidence=db_analysis_dict["confidence"],
            freshness_score=db_analysis_dict["freshness_score"],
            spoilage_status=db_analysis_dict["spoilage_status"],
            analyzed_at=db_analysis_dict["analysis_timestamp"].isoformat(),
            model_version=db_analysis_dict["model_version"],
            product_id=product_id,
            batch_id=batch_id,
            estimated_shelf_life_days=db_analysis_dict["estimated_shelf_life_days"],
            recommendation=db_analysis_dict["recommendation"]
        )
        
        return assessment

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/history", response_model=List[AnalysisHistoryItem])
def get_analysis_history(db: Database = Depends(get_db)):
    analyses = list(db.freshness_analyses.find().sort("analysis_timestamp", -1).limit(20))
    
    history = []
    for a in analyses:
        history.append(AnalysisHistoryItem(
            id=str(a["_id"]),
            classification=a["predicted_class"],
            confidence=a["confidence"],
            freshness_score=a["freshness_score"],
            analyzed_at=a["analysis_timestamp"].isoformat(),
            image_url=f"/static/{a['image_path']}",
            estimated_shelf_life_days=a.get("estimated_shelf_life_days", 0),
            recommendation=a.get("recommendation", "N/A")
        ))
    return history
