from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    name_bn = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False, default="citizen", index=True) # citizen, data_entry, reviewer, officer, admin
    designation = Column(String(100), nullable=True)
    designation_bn = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
