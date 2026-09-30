from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

@router.get("/")
def get_inventory_status() -> Dict[str, Any]:
    """
    Returns full inventory list with freshness and shelf life telemetry.
    """
    return {
        "kpis": {
            "tracked_skus": 148,
            "physical_units": 428500,
            "fresh_prime": 312800,
            "at_risk_window": 68400,
            "near_spoilage": 18200,
            "loss_exposure": 245000
        },
        "inventory": [
            {
                "product": "Ripe Vine Tomatoes",
                "sku": "SKU-VNE-8821",
                "category": "Vine Produce",
                "batch": "TOM-BCH-01",
                "zone": "Cold Zone A-12",
                "units": "1,240 kg",
                "score": 91,
                "grade": "Grade A",
                "grade_color": "success",
                "days_left": 6.0,
                "date_expiry": "Oct 28 2026",
                "emoji": "🍅"
            },
            {
                "product": "Organic Whole Milk 1L",
                "sku": "SKU-DAI-1044",
                "category": "Dairy Line",
                "batch": "MLK-BCH-18",
                "zone": "Chiller B-04",
                "units": "4,800 units",
                "score": 68,
                "grade": "Grade B",
                "grade_color": "warning",
                "days_left": 2.0,
                "date_expiry": "Oct 24 2026",
                "emoji": "🥛"
            },
            {
                "product": "Baby Spinach Clamshells",
                "sku": "SKU-GRN-3092",
                "category": "Leafy Greens",
                "batch": "SPN-BCH-09",
                "zone": "Cold Vault C-01",
                "units": "850 units",
                "score": 42,
                "grade": "Grade C",
                "grade_color": "danger",
                "days_left": 1.0,
                "date_expiry": "Oct 23 2026",
                "emoji": "🥬"
            },
            {
                "product": "Hass Avocados Stage 3",
                "sku": "SKU-AVO-4410",
                "category": "Exotic Produce",
                "batch": "AVO-BCH-44",
                "zone": "Ripening Rm 2",
                "units": "2,150 kg",
                "score": 76,
                "grade": "Grade A-",
                "grade_color": "success",
                "days_left": 3.0,
                "date_expiry": "Oct 25 2026",
                "emoji": "🥑"
            }
        ],
        "risk_exposure": [
            { "category": "Leafy Greens (Rapid Respiration)", "percentage": 38, "level": "danger" },
            { "category": "Fresh Seafood", "percentage": 24, "level": "danger" },
            { "category": "Dairy Products", "percentage": 19, "level": "warning" },
            { "category": "Stone Fruits", "percentage": 12, "level": "warning" },
            { "category": "Hard Produce", "percentage": 4, "level": "success" }
        ],
        "fefo_hub": {
            "pending_batches": 8,
            "compliance_velocity": 94.2
        }
    }
