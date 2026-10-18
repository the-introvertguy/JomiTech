from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class VerificationReceipt(Base):
    __tablename__ = "verification_receipts"

    id = Column(String(50), primary_key=True, index=True)
    opaque_id = Column(String(64), unique=True, index=True, nullable=False) # Privacy-safe non-enumerable QR ID
    document_id = Column(String(50), ForeignKey("documents.id"), nullable=False, index=True)
    sha256_hash = Column(String(64), nullable=False)
    ed25519_signature = Column(Text, nullable=False)
    key_id = Column(String(50), nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    is_revoked = Column(Boolean, default=False)
    revocation_reason = Column(Text, nullable=True)

    # Relationships
    document = relationship("Document")
