import uuid
import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_current_user
from backend.app.models.user import User
from backend.app.models.mutation import MutationCase, MutationEvent, MutationChecklistItem
from backend.app.models.audit import AuditLog
from backend.app.schemas.mutation import (
    MutationCaseSummaryOut,
    MutationCaseDetailOut,
    MutationCaseCreateRequest,
    MutationTransitionRequest,
    PublicMutationTrackOut,
)

router = APIRouter(tags=["mutations"])

# Strict simulated state machine transitions
ALLOWED_TRANSITIONS = {
    "DRAFT": ["SUBMITTED"],
    "SUBMITTED": ["DOCUMENT_CHECK", "NEEDS_CORRECTION", "REJECTED"],
    "DOCUMENT_CHECK": ["OFFICER_REVIEW", "NEEDS_CORRECTION", "REJECTED"],
    "OFFICER_REVIEW": ["HEARING", "DECISION_RECORDED", "NEEDS_CORRECTION", "REJECTED"],
    "HEARING": ["DECISION_RECORDED", "NEEDS_CORRECTION", "REJECTED"],
    "DECISION_RECORDED": ["COMPLETED", "REJECTED"],
    "NEEDS_CORRECTION": ["SUBMITTED", "REJECTED"],
    "COMPLETED": [],
    "REJECTED": [],
}

STAGE_LABELS = {
    "DRAFT": ("খসড়া আবেদন", "Draft Application"),
    "SUBMITTED": ("দাখিলকৃত", "Submitted"),
    "DOCUMENT_CHECK": ("কাগজপত্র যাচাইধীন", "Document Verification"),
    "OFFICER_REVIEW": ("সহকারী কর্মকর্তা পর্যালোচনা", "Officer Review"),
    "HEARING": ("শুনানি পর্যায়", "Hearing Stage"),
    "DECISION_RECORDED": ("আদেশ লিপিবদ্ধ", "Decision Recorded"),
    "COMPLETED": ("নামজারি সম্পন্ন ও খতিয়ান সৃজিত", "Completed & Mutated"),
    "REJECTED": ("নামজারি না-মঞ্জুর", "Rejected"),
    "NEEDS_CORRECTION": ("সংশোধন আবশ্যক", "Needs Correction"),
}

DEFAULT_CHECKLIST = [
    ("DEED_VERIFIED", "মূল দলিলের বালাম যাচাই ও সত্যতা নিশ্চিতকরণ", "Original Registry volume checked and verified"),
    ("KHATIAN_CHAIN_CHECKED", "সিএস থেকে বিএস খতিয়ান শৃঙ্খল পরীক্ষা", "CS to BS khatian lineage continuity verified"),
    ("FIELD_REPORT_RECEIVED", "ইউনিয়ন ভূমি উপ-সহকারীর দখল তদন্ত প্রতিবেদন প্রাপ্তি", "Field possession report received"),
    ("NOTICE_SERVED", "সহ-শরিক ও স্বার্থসংশ্লিষ্ট পক্ষগণকে নোটিশ জারি", "Notice served to co-sharers and interested parties"),
    ("NO_ACQUISITION_FLAG", "সম্পত্তি সরকারি খাস বা অধিগ্রহণমুক্ত মর্মে প্রত্যয়ন", "Clear of government khas or acquisition notices"),
]

@router.get("/mutation-cases", response_model=List[MutationCaseSummaryOut])
def list_mutation_cases(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List simulated mutation cases."""
    query = db.query(MutationCase)
    if status_filter:
        query = query.filter(MutationCase.status == status_filter)
    return query.order_by(MutationCase.updated_at.desc()).all()

@router.get("/mutation-cases/{id}", response_model=MutationCaseDetailOut)
def get_mutation_case_detail(id: str, db: Session = Depends(get_db)):
    """Retrieve full officer mutation case view with checklist and events."""
    case = db.query(MutationCase).filter(MutationCase.id == id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Mutation case not found")
    return case

@router.post("/mutation-cases", response_model=MutationCaseDetailOut, status_code=status.HTTP_201_CREATED)
def create_mutation_case(
    req: MutationCaseCreateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Initiate a simulated mutation case."""
    case_num = f"MUT-2024-{uuid.uuid4().hex[:4].upper()}"
    opaque_ref = f"mut-ref-{uuid.uuid4().hex[:10]}"
    
    # Translate digits for BN representation
    en_to_bn = str.maketrans("0123456789", "০১২৩৪৫৬৭৮৯")
    case_num_bn = f"নামজারি-২০২৪-{case_num.split('-')[-1].translate(en_to_bn)}"

    case = MutationCase(
        id=f"MUT-{uuid.uuid4().hex[:8].upper()}",
        case_no=case_num,
        case_no_bn=case_num_bn,
        opaque_reference=opaque_ref,
        parcel_id=req.parcel_id,
        deed_id=req.deed_id,
        applicant_name=req.applicant_name,
        applicant_name_bn=req.applicant_name_bn,
        applicant_nid=req.applicant_nid,
        status="SUBMITTED",
        remarks=req.remarks,
    )
    db.add(case)
    db.flush()

    # Add default checklist items
    for code, lbl_bn, lbl_en in DEFAULT_CHECKLIST:
        db.add(MutationChecklistItem(
            id=f"MCL-{uuid.uuid4().hex[:8].upper()}",
            case_id=case.id,
            item_code=code,
            label_bn=lbl_bn,
            label_en=lbl_en,
            is_checked=False,
        ))

    # Add initial submission event
    db.add(MutationEvent(
        id=f"ME-{uuid.uuid4().hex[:8].upper()}",
        case_id=case.id,
        from_stage="DRAFT",
        to_stage="SUBMITTED",
        actor_name=req.applicant_name_bn,
        notes="সিমুলেটেড ই-নামজারি আবেদন দাখিল করা হয়েছে।",
    ))

    db.commit()
    db.refresh(case)
    return case

@router.post("/mutation-cases/{id}/transition", response_model=MutationCaseDetailOut)
def transition_mutation_case(
    id: str,
    req: MutationTransitionRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Transition a mutation case to the next stage following strict state machine rules.
    Updates checklist, creates transition event, and generates an audit log.
    """
    case = db.query(MutationCase).filter(MutationCase.id == id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Mutation case not found")

    current_stage = case.status
    target_stage = req.to_stage.upper()

    allowed = ALLOWED_TRANSITIONS.get(current_stage, [])
    if target_stage not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid transition from '{current_stage}' to '{target_stage}'. Allowed: {allowed}",
        )

    # Update checklist if supplied
    if req.checklist_updates:
        for item in case.checklist:
            if item.item_code in req.checklist_updates:
                item.is_checked = req.checklist_updates[item.item_code]
                item.checked_by = current_user.name if current_user else "Land Officer"
                item.checked_at = datetime.utcnow()

    # Create transition event
    actor_name = current_user.name_bn if current_user else "সহকারী কমিশনার (ভূমি)"
    db.add(MutationEvent(
        id=f"ME-{uuid.uuid4().hex[:8].upper()}",
        case_id=case.id,
        from_stage=current_stage,
        to_stage=target_stage,
        actor_id=current_user.id if current_user else None,
        actor_name=actor_name,
        notes=req.reason.strip(),
        checklist_snapshot_json=json.dumps(req.checklist_updates or {}),
    ))

    # Update case status
    case.status = target_stage
    case.updated_at = datetime.utcnow()

    # Audit Log
    db.add(AuditLog(
        id=f"AUD-{uuid.uuid4().hex[:8].upper()}",
        actor_id=current_user.id if current_user else "usr_officer_01",
        actor_name=current_user.name if current_user else "Land Officer",
        actor_role=current_user.role if current_user else "officer",
        action=f"MUTATION_TRANSITION_{current_stage}_TO_{target_stage}",
        entity_type="MutationCase",
        entity_id=case.id,
        metadata_json=json.dumps({"reason": req.reason, "from": current_stage, "to": target_stage}),
    ))

    db.commit()
    db.refresh(case)
    return case

@router.get("/public/mutation-track/{opaque_reference}", response_model=PublicMutationTrackOut)
def public_track_mutation(opaque_reference: str, db: Session = Depends(get_db)):
    """
    Public citizen tracker. Exposes only stage, date, generic office, and masked case number.
    Strictly preserves privacy by excluding applicant identity, documents, and internal notes.
    """
    case = (
        db.query(MutationCase)
        .filter(MutationCase.opaque_reference == opaque_reference)
        .first()
    )
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No mutation record found for this tracking reference.",
        )

    bn_label, en_label = STAGE_LABELS.get(case.status, (case.status, case.status))

    # Mask case number (e.g. MUT-2024-**12)
    parts = case.case_no.split("-")
    masked_no = f"{parts[0]}-{parts[1]}-**{parts[-1][-2:]}" if len(parts) >= 3 else "MUT-****"

    return PublicMutationTrackOut(
        opaque_reference=case.opaque_reference,
        case_no_masked=masked_no,
        status=case.status,
        status_label_bn=bn_label,
        status_label_en=en_label,
        office_label_bn=case.office_name_bn,
        office_label_en=case.office_name,
        submitted_date=str(case.submitted_at.date()),
        last_updated=str(case.updated_at.date()),
        simulation_notice_bn="সতর্কতা: এটি সিমুলেটেড ওয়ার্কফ্লো — এটি কোনো সরকারি সিস্টেমে দাখিল হয়নি।",
        simulation_notice_en="Notice: This is a simulated workflow — not submitted to an official government office.",
        contains_pii=False,
    )
