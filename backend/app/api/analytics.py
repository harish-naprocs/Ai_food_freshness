from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_analytics() -> Dict[str, Any]:
    """
    Provides aggregated metrics for the Executive Overview Dashboard.
    """
    return {
        "kpis": {
            "total_inventory": 12480,
            "fresh_inventory": 8942,
            "at_risk_inventory": 1284,
            "near_spoilage": 428,
            "waste_prevented": 480000,
            "freshness_score": 82
        },
        "health_trend": [
            { "name": "Day 1", "fresh": 95, "good": 80, "acceptable": 60, "risk": 20 },
            { "name": "Day 7", "fresh": 92, "good": 82, "acceptable": 58, "risk": 22 },
            { "name": "Day 14", "fresh": 90, "good": 85, "acceptable": 55, "risk": 25 },
            { "name": "Day 21", "fresh": 94, "good": 81, "acceptable": 60, "risk": 21 },
            { "name": "Today", "fresh": 96, "good": 83, "acceptable": 62, "risk": 18 }
        ],
        "risk_distribution": [
            { "name": "Healthy / Optimal", "value": 71.7, "color": "#10b981" },
            { "name": "Watch / Attention", "value": 14.6, "color": "#3b82f6" },
            { "name": "At Risk (72h)", "value": 10.3, "color": "#f59e0b" },
            { "name": "Critical Action", "value": 3.4, "color": "#ef4444" }
        ],
        "attention_items": [
            {
                "product": "Ripe Vine Tomatoes",
                "grade": "Grade 1 Fresh",
                "batch": "TOM-BCH-01",
                "zone": "Zone A-12",
                "score": 91,
                "days_left": 6.0,
                "risk_tier": "Low Risk",
                "emoji": "🍅"
            },
            {
                "product": "Organic Whole Milk",
                "grade": "Dairy Line 4",
                "batch": "MLK-BCH-18",
                "zone": "Chiller B-04",
                "score": 68,
                "days_left": 2.0,
                "risk_tier": "Medium",
                "emoji": "🥛"
            },
            {
                "product": "Baby Spinach Pack",
                "grade": "Rapid Oxidation",
                "batch": "SPN-BCH-09",
                "zone": "Cold Vault C-01",
                "score": 42,
                "days_left": 1.0,
                "risk_tier": "Critical",
                "emoji": "🥬"
            }
        ],
        "insights": [
            {
                "type": "CRITICAL SPOILAGE ALERT",
                "level": "danger",
                "time": "Just now",
                "description": "14 batches show elevated spoilage risk across Cold Storage C due to micro-climate variance. Estimated loss potential: ₹1.2L.",
                "action": "Authorize Emergency Cooling"
            },
            {
                "type": "FEFO ROTATION PROTOCOL",
                "level": "warning",
                "time": "42m ago",
                "description": "312 items of Dairy SKU-092 should be rotated to retail front within 48 hours to prevent markdown losses.",
                "action": "Push Work Order to Bay Staff"
            },
            {
                "type": "QUALITY CONFIDENCE",
                "level": "success",
                "time": "1h ago",
                "description": "Tomato batch TOM-BCH-01 exhibits 94.7% CV freshness confidence. Safe for premium grade retail dispatch with zero deduction risk.",
                "action": None
            }
        ]
    }
