from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class KhatianRecord(Base):
    __tablename__ = "khatian_records"

    id = Column(String(50), primary_key=True, index=True)
    parcel_id = Column(String(50), ForeignKey("land_parcels.id"), nullable=False, index=True)
    survey_type = Column(String(20), nullable=False, index=True) # CS, SA, RS, BS
    khatian_no = Column(String(50), nullable=False, index=True)
    khatian_no_bn = Column(String(50), nullable=False)
    survey_year = Column(Integer, nullable=True)
    predecessor_khatian_id = Column(String(50), ForeignKey("khatian_records.id"), nullable=True)
    remarks = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    provenance = Column(String(200), default="Synthetic Record Office Archive")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    parcel = relationship("LandParcel")
    predecessor = relationship("KhatianRecord", remote_side=[id])
    owners = relationship("KhatianOwner", back_populates="khatian", cascade="all, delete-orphan")


class KhatianOwner(Base):
    __tablename__ = "khatian_owners"

    id = Column(String(50), primary_key=True, index=True)
    khatian_id = Column(String(50), ForeignKey("khatian_records.id"), nullable=False, index=True)
    owner_id = Column(String(50), ForeignKey("owners.id"), nullable=False, index=True)
    share_fraction = Column(Float, nullable=False) # e.g. 0.5000 (representing 50% or 8 ana)
    share_ana = Column(String(50), nullable=True) # e.g. "৮ আনা" / "8 ana"
    area_owned = Column(Float, nullable=True) # calculated portion of parcel area
    effective_from = Column(DateTime, nullable=True)
    effective_to = Column(DateTime, nullable=True)

    # Relationships
    khatian = relationship("KhatianRecord", back_populates="owners")
    owner = relationship("Owner")
