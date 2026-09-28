from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import random
from datetime import datetime

router = APIRouter()

class StorageCondition(BaseModel):
    unit_id: str
    temperature_celsius: float
    humidity_percent: float
    status: str
    last_updated: str

@router.get("/status", response_model=List[StorageCondition])
def get_storage_status():
    """
    Simulates real-time IoT sensor data for storage units.
    """
    units = []
    # Unit 1: Tomatoes/Apples (Optimal)
    units.append(StorageCondition(
        unit_id="UNIT-A (Produce)",
        temperature_celsius=round(random.uniform(4.0, 6.0), 1),
        humidity_percent=round(random.uniform(85.0, 90.0), 1),
        status="Optimal",
        last_updated=datetime.utcnow().isoformat()
    ))
    
    # Unit 2: Bananas (Warmer, dry)
    units.append(StorageCondition(
        unit_id="UNIT-B (Tropical)",
        temperature_celsius=round(random.uniform(13.0, 15.0), 1),
        humidity_percent=round(random.uniform(90.0, 95.0), 1),
        status="Optimal",
        last_updated=datetime.utcnow().isoformat()
    ))
    
    # Unit 3: Danger Simulation (Too warm)
    units.append(StorageCondition(
        unit_id="UNIT-C (Leafy Greens)",
        temperature_celsius=round(random.uniform(10.0, 12.0), 1), # Too warm for spinach
        humidity_percent=round(random.uniform(60.0, 70.0), 1), # Too dry
        status="Warning: High Temp",
        last_updated=datetime.utcnow().isoformat()
    ))

    return units
