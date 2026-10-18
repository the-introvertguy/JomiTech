from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(50), primary_key=True, index=True)
    original_filename = Column(String(255), nullable=False)
    storage_key = Column(String(255), nullable=False) # Random UUID on private storage
    mime_type = Column(String(100), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True) # Exact byte integrity hash
    source = Column(String(50), default="synthetic_upload") # synthetic_upload, mock_archive
    status = Column(String(30), default="UPLOADED", index=True) # UPLOADED, EXTRACTED, APPROVED, REJECTED
    uploaded_by = Column(String(50), ForeignKey("users.id"), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    uploader = relationship("User")
