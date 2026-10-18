from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Text, Integer
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class ExtractionJob(Base):
    __tablename__ = "extraction_jobs"

    id = Column(String(50), primary_key=True, index=True)
    document_id = Column(String(50), ForeignKey("documents.id"), nullable=False, index=True)
    ocr_engine = Column(String(50), default="tesseract-ben+eng")
    ocr_version = Column(String(50), default="5.3.0")
    status = Column(String(30), default="PENDING_REVIEW", index=True) # PENDING_REVIEW, APPROVED, REJECTED
    raw_ocr_text = Column(Text, nullable=True)
    average_confidence = Column(Float, default=0.0)
    rejection_reason = Column(Text, nullable=True)
    reviewer_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    document = relationship("Document")
    reviewer = relationship("User")
    fields = relationship("ExtractedField", back_populates="job", cascade="all, delete-orphan")


class ExtractedField(Base):
    __tablename__ = "extracted_fields"

    id = Column(String(50), primary_key=True, index=True)
    job_id = Column(String(50), ForeignKey("extraction_jobs.id"), nullable=False, index=True)
    field_name = Column(String(50), nullable=False, index=True) # deed_no, dag_no, khatian_no, seller_name, buyer_name, area, registration_date
    raw_value = Column(String(255), nullable=True)
    normalized_value = Column(String(255), nullable=True)
    confidence = Column(Float, default=1.0) # 0.0 - 1.0
    source_page = Column(Integer, default=1)
    reviewer_value = Column(String(255), nullable=True) # Corrected value by officer
    is_verified = Column(Boolean, default=False)
    is_critical = Column(Boolean, default=True)

    # Relationships
    job = relationship("ExtractionJob", back_populates="fields")
