from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class AdministrativeAreaOut(BaseModel):
    id: str
    division: str
    division_bn: str
    district: str
    district_bn: str
    upazila: str
    upazila_bn: str
    mouza: str
    mouza_bn: str
    jl_no: Optional[str] = None
    jl_no_bn: Optional[str] = None

    class Config:
        from_attributes = True

class OwnerShareOut(BaseModel):
    owner_id: str
    name: str
    name_bn: str
    father_name: Optional[str] = None
    father_name_bn: Optional[str] = None
    share_fraction: float
    share_ana: Optional[str] = None
    area_owned: Optional[float] = None

    class Config:
        from_attributes = True

class EncumbranceOut(BaseModel):
    id: str
    indicator_type: str
    title_bn: str
    title_en: str
    description_bn: str
    description_en: str
    case_ref: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class ParcelSummaryOut(BaseModel):
    id: str
    dag_no: str
    dag_no_bn: str
    cs_dag: Optional[str] = None
    sa_dag: Optional[str] = None
    rs_dag: Optional[str] = None
    bs_dag: Optional[str] = None
    total_area: float
    area_unit: str
    land_class: str
    land_class_bn: str
    administrative_area: AdministrativeAreaOut
    current_owners: List[OwnerShareOut]
    risk_score: int
    risk_level: str # LOW, MEDIUM, HIGH

    class Config:
        from_attributes = True

class KhatianTimelineOut(BaseModel):
    id: str
    survey_type: str # CS, SA, RS, BS
    khatian_no: str
    khatian_no_bn: str
    survey_year: Optional[int] = None
    predecessor_khatian_id: Optional[str] = None
    owners: List[OwnerShareOut]
    remarks: Optional[str] = None

    class Config:
        from_attributes = True

class TransferTimelineOut(BaseModel):
    id: str
    deed_no: str
    deed_no_bn: str
    registration_office_bn: str
    registration_date: datetime
    transferred_area: float
    transferred_share: float
    seller_name_bn: str
    buyer_name_bn: str
    status: str

    class Config:
        from_attributes = True

class ParcelDetailOut(BaseModel):
    id: str
    dag_no: str
    dag_no_bn: str
    cs_dag: Optional[str] = None
    sa_dag: Optional[str] = None
    rs_dag: Optional[str] = None
    bs_dag: Optional[str] = None
    total_area: float
    area_unit: str
    land_class: str
    land_class_bn: str
    polygon_geojson: Optional[str] = None
    administrative_area: AdministrativeAreaOut
    current_owners: List[OwnerShareOut]
    encumbrances: List[EncumbranceOut]
    khatians: List[KhatianTimelineOut]
    transfers: List[TransferTimelineOut]
    mutation_status: Optional[str] = None
    mutation_case_no: Optional[str] = None
    risk_score: int
    risk_level: str
    risk_summary_bn: Optional[str] = None
    risk_summary_en: Optional[str] = None

    class Config:
        from_attributes = True
