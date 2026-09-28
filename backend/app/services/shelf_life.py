class ShelfLifePredictor:
    def __init__(self):
        # Base shelf life in days for optimal fresh state
        self.base_shelf_life = {
            "Tomatoes": 14,
            "Apples": 30,
            "Bananas": 7,
            "Spinach": 10,
            "Default": 14
        }
    
    def predict(self, product_name: str, freshness_score: float, classification: str) -> dict:
        """
        Predicts remaining shelf life and generates an actionable recommendation.
        """
        base_days = self.base_shelf_life.get(product_name, self.base_shelf_life["Default"])
        
        # Calculate remaining days based on the freshness score percentage (0-100)
        # If freshness score is 100, remaining days = base_days
        # If freshness score is 0, remaining days = 0
        remaining_days = round((freshness_score / 100.0) * base_days)
        
        # Recommendation Engine Logic
        if classification == "Spoiled" or remaining_days <= 0:
            recommendation = "DISPOSE: High risk of cross-contamination. Remove from inventory immediately."
            action_code = "DANGER"
        elif classification == "Near Spoilage" or remaining_days <= 2:
            recommendation = "DISCOUNT: Sell immediately at clearance pricing. Move to front of display."
            action_code = "WARNING"
        elif classification == "Acceptable" or remaining_days <= 5:
            recommendation = "PRIORITIZE: Standard retail conditions. Ensure proper rotation (FIFO)."
            action_code = "INFO"
        else:
            recommendation = "OPTIMAL: Standard storage. Good for long-term holding or premium retail."
            action_code = "SUCCESS"
            
        return {
            "estimated_shelf_life_days": remaining_days,
            "recommendation": recommendation,
            "action_code": action_code
        }

shelf_life_service = ShelfLifePredictor()
