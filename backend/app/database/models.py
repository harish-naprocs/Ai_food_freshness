from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # Admin, Quality Inspector, etc.
    is_active = Column(Boolean, default=True)

class FoodProduct(Base):
    __tablename__ = "food_products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    description = Column(Text, nullable=True)
    batches = relationship("FoodBatch", back_populates="product")

class FoodBatch(Base):
    __tablename__ = "food_batches"
    id = Column(Integer, primary_key=True, index=True)
    batch_number = Column(String, unique=True, index=True)
    product_id = Column(Integer, ForeignKey("food_products.id"))
    received_date = Column(DateTime, default=datetime.utcnow)
    product = relationship("FoodProduct", back_populates="batches")
    images = relationship("FoodImage", back_populates="batch")

class FoodImage(Base):
    __tablename__ = "food_images"
    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String)
    original_filename = Column(String)
    content_type = Column(String)
    image_size = Column(Integer)
    product_id = Column(Integer, ForeignKey("food_products.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("food_batches.id"), nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    batch = relationship("FoodBatch", back_populates="images")
    analysis = relationship("FreshnessAnalysis", back_populates="image", uselist=False)

class FreshnessAnalysis(Base):
    __tablename__ = "freshness_analyses"
    id = Column(Integer, primary_key=True, index=True)
    food_image_id = Column(Integer, ForeignKey("food_images.id"))
    model_version = Column(String)
    predicted_class = Column(String)
    confidence = Column(Float)
    freshness_score = Column(Float)
    spoilage_status = Column(String)
    analysis_timestamp = Column(DateTime, default=datetime.utcnow)
    
    image = relationship("FoodImage", back_populates="analysis")
