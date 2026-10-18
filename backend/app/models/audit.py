from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from backend.app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, index=True)
    actor_id = Column(String(50), nullable=True, index=True)
    actor_name = Column(String(100), nullable=False)
    actor_role = Column(String(30), nullable=False, index=True)
    action = Column(String(100), nullable=False, index=True) # e.g. EXTRACTION_APPROVED, MUTATION_TRANSITION, RECEIPT_ISSUED
    entity_type = Column(String(50), nullable=False, index=True) # Deed, ExtractionJob, MutationCase, Parcel
    entity_id = Column(String(50), nullable=False, index=True)
    request_ip = Column(String(50), nullable=True)
    metadata_json = Column(Text, nullable=True) # Safe redacted metadata only
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
