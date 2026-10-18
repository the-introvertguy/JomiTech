from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Deed(Base):
    __tablename__ = "deeds"

    id = Column(String(50), primary_key=True, index=True)
    deed_no = Column(String(50), nullable=False, index=True)
    deed_no_bn = Column(String(50), nullable=False)
    registration_office = Column(String(100), nullable=False)
    registration_office_bn = Column(String(100), nullable=False)
    registration_date = Column(DateTime, nullable=False, index=True)
    sub_registry_code = Column(String(30), nullable=True)
    parcel_id = Column(String(50), ForeignKey("land_parcels.id"), nullable=False, index=True)
    transferred_area = Column(Float, nullable=False)
    transferred_share = Column(Float, nullable=False) # e.g. 1.0 or 0.25
    consideration_amount = Column(Float, nullable=True) # BDT value
    status = Column(String(30), default="APPROVED", index=True) # APPROVED, PENDING_REVIEW, REJECTED
    document_id = Column(String(50), ForeignKey("documents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    parcel = relationship("LandParcel")
    document = relationship("Document", foreign_keys=[document_id])
    transactions = relationship("Transaction", back_populates="deed", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(50), primary_key=True, index=True)
    deed_id = Column(String(50), ForeignKey("deeds.id"), nullable=False, index=True)
    seller_id = Column(String(50), ForeignKey("owners.id"), nullable=False, index=True)
    buyer_id = Column(String(50), ForeignKey("owners.id"), nullable=False, index=True)
    share_transferred = Column(Float, nullable=False) # 0.0 - 1.0
    area_transferred = Column(Float, nullable=False)
    effective_date = Column(DateTime, nullable=False)
    status = Column(String(30), default="COMPLETED") # COMPLETED, REVERSED, CONFLICTED

    # Relationships
    deed = relationship("Deed", back_populates="transactions")
    seller = relationship("Owner", foreign_keys=[seller_id])
    buyer = relationship("Owner", foreign_keys=[buyer_id])


class OwnershipHistory(Base):
    __tablename__ = "ownership_history"

    id = Column(String(50), primary_key=True, index=True)
    parcel_id = Column(String(50), ForeignKey("land_parcels.id"), nullable=False, index=True)
    owner_id = Column(String(50), ForeignKey("owners.id"), nullable=False, index=True)
    deed_id = Column(String(50), ForeignKey("deeds.id"), nullable=True)
    khatian_id = Column(String(50), ForeignKey("khatian_records.id"), nullable=True)
    share_fraction = Column(Float, nullable=False)
    area = Column(Float, nullable=False)
    effective_from = Column(DateTime, nullable=False)
    effective_to = Column(DateTime, nullable=True)
    is_current = Column(Boolean, default=True, index=True)

    # Relationships
    parcel = relationship("LandParcel")
    owner = relationship("Owner")
    deed = relationship("Deed")
    khatian = relationship("KhatianRecord")
