import os
import uuid
import hashlib
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_current_user
from backend.app.core.config import settings
from backend.app.models.user import User
from backend.app.models.document import Document
from backend.app.models.extraction import ExtractionJob, ExtractedField
from backend.app.schemas.document import DocumentOut, ExtractionJobOut
from backend.ai.ocr.provider import get_ocr_provider
from backend.ai.extraction.extractor import DeterministicExtractor

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Safely ingest a synthetic document. Validates content size, MIME type,
    computes SHA-256 server-side, and persists to private storage directory.
    """
    # 1. Content size & MIME verification
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024*1024)}MB",
        )

    # Validate MIME type
    content_type = file.content_type or "application/octet-stream"
    if content_type not in settings.ALLOWED_MIME_TYPES and not file.filename.lower().endswith((".pdf", ".png", ".jpg", ".jpeg")):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{content_type}'. Allowed: PDF, PNG, JPEG",
        )

    # 2. Server-side SHA-256 Byte Hash
    sha256_hash = hashlib.sha256(file_bytes).hexdigest()

    # 3. Randomized private storage key
    file_ext = os.path.splitext(file.filename)[1] or ".bin"
    storage_filename = f"{uuid.uuid4().hex}{file_ext}"
    storage_path = os.path.join(settings.STORAGE_DIR, storage_filename)

    with open(storage_path, "wb") as f:
        f.write(file_bytes)

    # 4. Save to database
    doc_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
    doc = Document(
        id=doc_id,
        original_filename=file.filename,
        storage_key=storage_filename,
        mime_type=content_type,
        file_size_bytes=file_size,
        sha256_hash=sha256_hash,
        source="synthetic_upload",
        status="UPLOADED",
        uploaded_by=current_user.id if current_user else None,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.post("/{id}/extract", response_model=ExtractionJobOut)
def trigger_extraction(id: str, db: Session = Depends(get_db)):
    """Trigger OCR and deterministic extraction pipeline on an uploaded document."""
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = os.path.join(settings.STORAGE_DIR, doc.storage_key)
    ocr_provider = get_ocr_provider(prefer_synthetic=False)
    ocr_res = ocr_provider.extract_text(file_path, doc.mime_type)

    extractor = DeterministicExtractor()
    extracted_fields = extractor.extract_fields(ocr_res.text)

    avg_conf = (
        sum(f.confidence for f in extracted_fields) / len(extracted_fields)
        if extracted_fields
        else 0.0
    )

    job_id = f"JOB-{uuid.uuid4().hex[:8].upper()}"
    job = ExtractionJob(
        id=job_id,
        document_id=doc.id,
        ocr_engine=ocr_res.engine,
        ocr_version=ocr_res.version,
        status="PENDING_REVIEW",
        raw_ocr_text=ocr_res.text,
        average_confidence=round(avg_conf, 2),
    )
    db.add(job)
    db.flush()

    for idx, f in enumerate(extracted_fields):
        field_row = ExtractedField(
            id=f"FLD-{uuid.uuid4().hex[:8].upper()}",
            job_id=job.id,
            field_name=f.field_name,
            raw_value=f.raw_value,
            normalized_value=f.normalized_value,
            confidence=f.confidence,
            source_page=1,
            is_verified=False,
            is_critical=f.is_critical,
        )
        db.add(field_row)

    doc.status = "EXTRACTED"
    db.commit()
    db.refresh(job)
    return job

@router.post("/{id}/verify-copy")
async def verify_document_copy(
    id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Compare uploaded copy bytes against approved synthetic document hash.
    Mismatch is reported as 'No exact match', not automatic proof of forgery.
    """
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Reference document not found")

    file_bytes = await file.read()
    candidate_hash = hashlib.sha256(file_bytes).hexdigest()

    is_match = candidate_hash.lower() == doc.sha256_hash.lower()
    return {
        "reference_document_id": doc.id,
        "reference_sha256": doc.sha256_hash,
        "candidate_sha256": candidate_hash,
        "exact_match": is_match,
        "status": "VALID_BYTE_MATCH" if is_match else "HASH_MISMATCH",
        "message": (
            "Cryptographic byte match confirmed against reference document."
            if is_match
            else "No exact match found in approved synthetic repository (note: does not prove forgery; byte variation may result from scanning or re-encoding)."
        ),
        "message_bn": (
            "মূল রেফারেন্স ফাইলের সাথে শতভাগ ডিজিটাল বাইট মিল নিশ্চিত হয়েছে।"
            if is_match
            else "অনুমোদিত রেফারেন্সের সাথে হুবহু বাইট মিল পাওয়া যায়নি (সতর্কতা: এটি জালিয়াতির চূড়ান্ত প্রমাণ নয়; স্ক্যানার বা পিডিএফ রূপান্তরের ভিন্নতার কারণে হতে পারে)।"
        ),
    }

@router.get("/{id}/download")
def download_document(id: str, db: Session = Depends(get_db)):
    """Protected file download endpoint with proper headers."""
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = os.path.join(settings.STORAGE_DIR, doc.storage_key)
    if not os.path.exists(file_path):
        # Return fallback synthetic sample if storage file was purged in test
        raise HTTPException(status_code=404, detail="Storage file not available")

    return FileResponse(
        path=file_path,
        media_type=doc.mime_type,
        filename=doc.original_filename,
    )
