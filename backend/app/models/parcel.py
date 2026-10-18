from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class LandParcel(Base):
    __tablename__ = "land_parcels"

    id = Column(String(50), primary_key=True, index=True) # e.g. PCL-DH-101
    administrative_area_id = Column(String(50), ForeignKey("administrative_areas.id"), nullable=False)
    
    # Cadastral / Survey references
    dag_no = Column(String(30), nullable=False, index=True) # Latest Dag
    dag_no_bn = Column(String(30), nullable=False)
    cs_dag = Column(String(30), nullable=True)
    sa_dag = Column(String(30), nullable=True)
    rs_dag = Column(String(30), nullable=True)
    bs_dag = Column(String(30), nullable=True)
    
    # Land measurements
    total_area = Column(Float, nullable=False) # e.g. 15.5
    area_unit = Column(String(20), default="decimal") # decimal, acre, katha
    land_class = Column(String(50), default="Homestead")
    land_class_bn = Column(String(50), default="নাল/ভিটি")
    
    # Fictional spatial geojson (cadastral outline coordinates)
    polygon_geojson = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    administrative_area = relationship("AdministrativeArea")
    encumbrances = relationship("EncumbranceIndicator", back_populates="parcel", cascade="all, delete-orphan")


class EncumbranceIndicator(Base):
    __tablename__ = "encumbrance_indicators"

    id = Column(String(50), primary_key=True, index=True)
    parcel_id = Column(String(50), ForeignKey("land_parcels.id"), nullable=False, index=True)
    indicator_type = Column(String(30), nullable=False) # KHAS, ACQUISITION, ACTIVE_DISPUTE, VESTED
    title_bn = Column(String(100), nullable=False)
    title_en = Column(String(100), nullable=False)
    description_bn = Column(Text, nullable=False)
    description_en = Column(Text, nullable=False)
    case_ref = Column(String(100), nullable=True)
    provenance = Column(String(200), nullable=True) # Record source / Gazetted notification
    is_active = Column(Boolean, default=True)
    flagged_date = Column(DateTime, default=datetime.utcnow)

    parcel = relationship("LandParcel", back_populates="encumbrances")
