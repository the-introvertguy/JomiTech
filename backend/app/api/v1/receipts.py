import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_current_user
from backend.app.core.config import settings
from backend.app.core.crypto import sign_receipt_payload, verify_receipt_signature
from backend.app.models.user import User
from backend.app.models.document import Document
from backend.app.models.receipt import VerificationReceipt
from backend.app.models.audit import AuditLog
from backend.app.schemas.receipt import (
    ReceiptIssueRequest,
    ReceiptOut,
    PublicVerifyResponse,
    RevokeReceiptRequest,
)

router = APIRouter(tags=["receipts"])

CIVIC_EXPLANATION_EN = (
    "A valid cryptographic match confirms that the exact byte sequence of this document matches "
    "the reference copy approved in the synthetic registry. It proves digital integrity and non-tampering "
    "against this reference, but does not independently certify legal title, beneficial ownership, or official court validity."
)

CIVIC_EXPLANATION_BN = (
    "সঠিক ক্রিপ্টোগ্রাফিক মিল নিশ্চিত করে যে এই নথির ডিজিটাল বাইট সিকোয়েন্সটি সংরক্ষিত অনুমোদিত কপির "
    "সাথে শতভাগ অপরিবর্তিত রয়েছে। এটি ডিজিটাল অক্ষত অবস্থা ও পরিবর্তনহীনতা প্রমাণ করে, কিন্তু আদালতের স্বত্বাধিকার "
    "বা আইনি সার্টিফিকেটের বিকল্প নয়।"
)

@router.post("/receipts", response_model=ReceiptOut, status_code=status.HTTP_201_CREATED)
def issue_receipt(
    req: ReceiptIssueRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Issue a cryptographically signed Ed25519 verification receipt for an approved document.
    Signs the canonical payload containing key ID, opaque ID, SHA-256 hash, and issue timestamp.
    """
    doc = db.query(Document).filter(Document.id == req.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    opaque_id = f"rcp-{uuid.uuid4().hex}"
    issued_at = datetime.utcnow()
    key_id = settings.ACTIVE_KEY_ID

    signature_hex = sign_receipt_payload(
        opaque_id=opaque_id,
        sha256_hash=doc.sha256_hash,
        issued_at=issued_at,
        key_id=key_id,
    )

    receipt = VerificationReceipt(
        id=f"RCP-{uuid.uuid4().hex[:8].upper()}",
        opaque_id=opaque_id,
        document_id=doc.id,
        sha256_hash=doc.sha256_hash,
        ed25519_signature=signature_hex,
        key_id=key_id,
        issued_at=issued_at,
        is_revoked=False,
    )
    db.add(receipt)

    # Audit log
    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:8].upper()}",
        actor_id=current_user.id if current_user else "system",
        actor_name=current_user.name if current_user else "System Signer",
        actor_role=current_user.role if current_user else "system",
        action="RECEIPT_ISSUED_ED25519",
        entity_type="VerificationReceipt",
        entity_id=receipt.id,
        metadata_json=json.dumps({"document_id": doc.id, "key_id": key_id}),
    ))

    db.commit()
    db.refresh(receipt)
    return receipt

@router.get("/public/verify/{opaque_id}", response_model=PublicVerifyResponse)
def public_verify_receipt(opaque_id: str, db: Session = Depends(get_db)):
    """
    Public QR verification endpoint. Accepts opaque non-enumerable receipt identifier.
    Returns cryptographic integrity status and strictly zero citizen PII.
    """
    receipt = (
        db.query(VerificationReceipt)
        .filter(VerificationReceipt.opaque_id == opaque_id)
        .first()
    )

    if not receipt:
        return PublicVerifyResponse(
            opaque_id=opaque_id,
            status="UNKNOWN",
            sha256_match=False,
            signature_valid=False,
            civic_explanation=CIVIC_EXPLANATION_EN,
            civic_explanation_bn=CIVIC_EXPLANATION_BN,
            contains_pii=False,
        )

    # Verify Ed25519 digital signature
    sig_valid = verify_receipt_signature(
        opaque_id=receipt.opaque_id,
        sha256_hash=receipt.sha256_hash,
        issued_at=receipt.issued_at,
        key_id=receipt.key_id,
        signature_hex=receipt.ed25519_signature,
    )

    # Check byte hash against referenced document
    hash_match = False
    if receipt.document and receipt.document.sha256_hash == receipt.sha256_hash:
        hash_match = True

    # Determine status
    if receipt.is_revoked:
        final_status = "REVOKED"
    elif not sig_valid or not hash_match:
        final_status = "TAMPERED"
    else:
        final_status = "VALID"

    return PublicVerifyResponse(
        opaque_id=receipt.opaque_id,
        status=final_status,
        sha256_match=hash_match,
        signature_valid=sig_valid,
        document_sha256=receipt.sha256_hash,
        key_id=receipt.key_id,
        issued_at=receipt.issued_at,
        synthetic_reference_id=receipt.document_id,
        civic_explanation=CIVIC_EXPLANATION_EN,
        civic_explanation_bn=CIVIC_EXPLANATION_BN,
        contains_pii=False,
    )

@router.post("/receipts/{id}/revoke", response_model=ReceiptOut)
def revoke_receipt(
    id: str,
    req: RevokeReceiptRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Revoke a previously issued verification receipt with documented audit reason."""
    receipt = db.query(VerificationReceipt).filter(VerificationReceipt.id == id).first()
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")

    receipt.is_revoked = True
    receipt.revocation_reason = req.reason.strip()

    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:8].upper()}",
        actor_id=current_user.id if current_user else "admin",
        actor_name=current_user.name if current_user else "Admin Officer",
        actor_role=current_user.role if current_user else "admin",
        action="RECEIPT_REVOKED",
        entity_type="VerificationReceipt",
        entity_id=receipt.id,
        metadata_json=json.dumps({"reason": req.reason}),
    ))

    db.commit()
    db.refresh(receipt)
    return receipt
