from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class DocumentOut(BaseModel):
    id: str
    original_filename: str
    mime_type: str
    file_size_bytes: int
    sha256_hash: str
    status: str
    source: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class ExtractedFieldOut(BaseModel):
    id: str
    job_id: str
    field_name: str
    raw_value: Optional[str] = None
    normalized_value: Optional[str] = None
    confidence: float
    source_page: int
    reviewer_value: Optional[str] = None
    is_verified: bool
    is_critical: bool

    class Config:
        from_attributes = True

class ExtractionJobOut(BaseModel):
    id: str
    document_id: str
    ocr_engine: str
    ocr_version: str
    status: str # PENDING_REVIEW, APPROVED, REJECTED
    raw_ocr_text: Optional[str] = None
    average_confidence: float
    rejection_reason: Optional[str] = None
    reviewer_id: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    document: DocumentOut
    fields: List[ExtractedFieldOut]

    class Config:
        from_attributes = True

class FieldCorrectionUpdate(BaseModel):
    field_name: str
    reviewer_value: str

class RejectJobRequest(BaseModel):
    reason: str
