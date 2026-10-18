from sqlalchemy import Column, String, Integer
from backend.app.core.database import Base

class AdministrativeArea(Base):
    __tablename__ = "administrative_areas"

    id = Column(String(50), primary_key=True, index=True)
    division = Column(String(50), nullable=False, index=True)
    division_bn = Column(String(50), nullable=False)
    district = Column(String(50), nullable=False, index=True)
    district_bn = Column(String(50), nullable=False)
    upazila = Column(String(50), nullable=False, index=True)
    upazila_bn = Column(String(50), nullable=False)
    mouza = Column(String(100), nullable=False, index=True)
    mouza_bn = Column(String(100), nullable=False)
    jl_no = Column(String(20), nullable=True) # J.L. No.
    jl_no_bn = Column(String(20), nullable=True)
