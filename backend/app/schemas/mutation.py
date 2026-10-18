from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel

class MutationChecklistItemOut(BaseModel):
    id: str
    item_code: str
    label_bn: str
    label_en: str
    is_checked: bool
    checked_by: Optional[str] = None
    checked_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MutationEventOut(BaseModel):
    id: str
    from_stage: str
    to_stage: str
    actor_name: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MutationCaseSummaryOut(BaseModel):
    id: str
    case_no: str
    case_no_bn: str
    opaque_reference: str
    parcel_id: str
    applicant_name: str
    applicant_name_bn: str
    status: str
    office_name: str
    office_name_bn: str
    submitted_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MutationCaseDetailOut(BaseModel):
    id: str
    case_no: str
    case_no_bn: str
    opaque_reference: str
    parcel_id: str
    deed_id: Optional[str] = None
    applicant_name: str
    applicant_name_bn: str
    status: str
    office_name: str
    office_name_bn: str
    remarks: Optional[str] = None
    submitted_at: datetime
    updated_at: datetime
    checklist: List[MutationChecklistItemOut]
    events: List[MutationEventOut]

    class Config:
        from_attributes = True

class MutationCaseCreateRequest(BaseModel):
    parcel_id: str
    deed_id: Optional[str] = None
    applicant_name: str
    applicant_name_bn: str
    applicant_nid: Optional[str] = None
    remarks: Optional[str] = None

class MutationTransitionRequest(BaseModel):
    to_stage: str
    reason: str
    checklist_updates: Optional[Dict[str, bool]] = None

class PublicMutationTrackOut(BaseModel):
    opaque_reference: str
    case_no_masked: str
    status: str
    status_label_bn: str
    status_label_en: str
    office_label_bn: str
    office_label_en: str
    submitted_date: str
    last_updated: str
    simulation_notice_bn: str
    simulation_notice_en: str
    contains_pii: bool = False
