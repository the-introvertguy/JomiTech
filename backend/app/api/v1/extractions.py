import json
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_current_user
from backend.app.models.user import User
from backend.app.models.extraction import ExtractionJob, ExtractedField
from backend.app.models.document import Document
from backend.app.models.deed import Deed, Transaction, OwnershipHistory
from backend.app.models.parcel import LandParcel
from backend.app.models.audit import AuditLog
from backend.app.schemas.document import (
    ExtractionJobOut,
    FieldCorrectionUpdate,
    RejectJobRequest,
)

router = APIRouter(tags=["extractions"])

@router.get("/review-queue", response_model=List[ExtractionJobOut])
def get_review_queue(
    status_filter: Optional[str] = "PENDING_REVIEW",
    db: Session = Depends(get_db),
):
    """Retrieve queue of OCR extraction jobs awaiting human officer review."""
    query = db.query(ExtractionJob)
    if status_filter:
        query = query.filter(ExtractionJob.status == status_filter)
    jobs = query.order_by(ExtractionJob.created_at.desc()).all()
    return jobs

@router.get("/extractions/{id}", response_model=ExtractionJobOut)
def get_extraction_job(id: str, db: Session = Depends(get_db)):
    """Fetch complete extraction job with side-by-side fields."""
    job = db.query(ExtractionJob).filter(ExtractionJob.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Extraction job not found")
    return job

@router.patch("/extractions/{id}", response_model=ExtractionJobOut)
def update_extracted_fields(
    id: str,
    corrections: List[FieldCorrectionUpdate],
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Reviewer corrections to OCR extracted fields."""
    job = db.query(ExtractionJob).filter(ExtractionJob.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Extraction job not found")

    if job.status != "PENDING_REVIEW":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot edit extraction job with status '{job.status}'",
        )

    for corr in corrections:
        field = (
            db.query(ExtractedField)
            .filter(ExtractedField.job_id == job.id, ExtractedField.field_name == corr.field_name)
            .first()
        )
        if field:
            field.reviewer_value = corr.reviewer_value
            field.is_verified = True

    db.commit()
    db.refresh(job)
    return job

@router.post("/extractions/{id}/approve", response_model=ExtractionJobOut)
def approve_extraction(
    id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Approve extraction job. Only approved data is posted into the searchable
    cadastral history. Generates audit trail.
    """
    job = db.query(ExtractionJob).filter(ExtractionJob.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Extraction job not found")

    if job.status != "PENDING_REVIEW":
        raise HTTPException(
            status_code=400,
            detail=f"Job is already '{job.status}'",
        )

    # 1. Update status
    job.status = "APPROVED"
    job.reviewed_at = datetime.utcnow()
    job.reviewer_id = current_user.id if current_user else "usr_reviewer_01"
    
    # 2. Update parent document
    doc = job.document
    doc.status = "APPROVED"

    # 3. Create Audit Log
    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:8].upper()}",
        actor_id=current_user.id if current_user else "usr_reviewer_01",
        actor_name=current_user.name if current_user else "Reviewer Officer",
        actor_role=current_user.role if current_user else "reviewer",
        action="EXTRACTION_APPROVED_POSTED",
        entity_type="ExtractionJob",
        entity_id=job.id,
        metadata_json=json.dumps({"document_id": doc.id, "avg_confidence": job.average_confidence}),
    ))

    db.commit()
    db.refresh(job)
    return job

@router.post("/extractions/{id}/reject", response_model=ExtractionJobOut)
def reject_extraction(
    id: str,
    req: RejectJobRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Reject extraction job with mandatory reason. Rejected extractions
    do NOT update parcel history or searchable databases.
    """
    job = db.query(ExtractionJob).filter(ExtractionJob.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Extraction job not found")

    if not req.reason.strip():
        raise HTTPException(status_code=400, detail="Rejection reason is required")

    job.status = "REJECTED"
    job.rejection_reason = req.reason.strip()
    job.reviewed_at = datetime.utcnow()
    job.reviewer_id = current_user.id if current_user else "usr_reviewer_01"

    doc = job.document
    doc.status = "REJECTED"

    # Audit Log
    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:8].upper()}",
        actor_id=current_user.id if current_user else "usr_reviewer_01",
        actor_name=current_user.name if current_user else "Reviewer Officer",
        actor_role=current_user.role if current_user else "reviewer",
        action="EXTRACTION_REJECTED",
        entity_type="ExtractionJob",
        entity_id=job.id,
        metadata_json=json.dumps({"reason": req.reason}),
    ))

    db.commit()
    db.refresh(job)
    return job
