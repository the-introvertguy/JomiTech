from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class ReceiptIssueRequest(BaseModel):
    document_id: str

class ReceiptOut(BaseModel):
    id: str
    opaque_id: str
    document_id: str
    sha256_hash: str
    ed25519_signature: str
    key_id: str
    issued_at: datetime
    expires_at: Optional[datetime] = None
    is_revoked: bool
    revocation_reason: Optional[str] = None

    class Config:
        from_attributes = True

class PublicVerifyResponse(BaseModel):
    opaque_id: str
    status: str # VALID, TAMPERED, REVOKED, EXPIRED, UNKNOWN
    sha256_match: bool
    signature_valid: bool
    document_sha256: Optional[str] = None
    key_id: Optional[str] = None
    issued_at: Optional[datetime] = None
    synthetic_reference_id: Optional[str] = None
    civic_explanation: str
    civic_explanation_bn: str
    contains_pii: bool = False

    class Config:
        from_attributes = True

class RevokeReceiptRequest(BaseModel):
    reason: str
