from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class MutationCase(Base):
    __tablename__ = "mutation_cases"

    id = Column(String(50), primary_key=True, index=True)
    case_no = Column(String(50), unique=True, index=True, nullable=False) # e.g. MUT-2024-9912
    case_no_bn = Column(String(50), nullable=False)
    opaque_reference = Column(String(64), unique=True, index=True, nullable=False) # For privacy-safe public tracker
    parcel_id = Column(String(50), ForeignKey("land_parcels.id"), nullable=False, index=True)
    deed_id = Column(String(50), ForeignKey("deeds.id"), nullable=True)
    applicant_name = Column(String(100), nullable=False)
    applicant_name_bn = Column(String(100), nullable=False)
    applicant_nid = Column(String(50), nullable=True) # Fictional masked demo ID
    status = Column(String(30), default="SUBMITTED", index=True) # DRAFT, SUBMITTED, DOCUMENT_CHECK, OFFICER_REVIEW, HEARING, DECISION_RECORDED, COMPLETED, REJECTED, NEEDS_CORRECTION
    office_name = Column(String(100), default="Tejgaon Circle AC Land Office (Simulated)")
    office_name_bn = Column(String(100), default="তেজগাঁও সার্কেল সহকারী কমিশনার (ভূমি) কার্যালয় (সিমুলেটেড)")
    remarks = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    parcel = relationship("LandParcel")
    deed = relationship("Deed")
    events = relationship("MutationEvent", back_populates="case", cascade="all, delete-orphan")
    checklist = relationship("MutationChecklistItem", back_populates="case", cascade="all, delete-orphan")


class MutationEvent(Base):
    __tablename__ = "mutation_events"

    id = Column(String(50), primary_key=True, index=True)
    case_id = Column(String(50), ForeignKey("mutation_cases.id"), nullable=False, index=True)
    from_stage = Column(String(30), nullable=False)
    to_stage = Column(String(30), nullable=False)
    actor_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    actor_name = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    checklist_snapshot_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    case = relationship("MutationCase", back_populates="events")
    actor = relationship("User")


class MutationChecklistItem(Base):
    __tablename__ = "mutation_checklist_items"

    id = Column(String(50), primary_key=True, index=True)
    case_id = Column(String(50), ForeignKey("mutation_cases.id"), nullable=False, index=True)
    item_code = Column(String(50), nullable=False) # DEED_VERIFIED, KHATIAN_CHAIN_CHECKED, FIELD_REPORT_RECEIVED, NOTICE_SERVED, NO_ACQUISITION_FLAG
    label_bn = Column(String(200), nullable=False)
    label_en = Column(String(200), nullable=False)
    is_checked = Column(Boolean, default=False)
    checked_by = Column(String(50), nullable=True)
    checked_at = Column(DateTime, nullable=True)

    # Relationships
    case = relationship("MutationCase", back_populates="checklist")
