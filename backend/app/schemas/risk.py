from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel

class RiskFindingOut(BaseModel):
    id: str
    rule_code: str
    severity: str
    score_contribution: int
    title_bn: str
    title_en: str
    evidence_data: Dict[str, Any]
    recommended_action_bn: str
    recommended_action_en: str
    limitation_notice_bn: str
    limitation_notice_en: str

    class Config:
        from_attributes = True

class RiskAssessmentOut(BaseModel):
    id: str
    parcel_id: str
    total_score: int
    risk_level: str
    rule_version: str
    assessed_at: datetime
    summary_bn: Optional[str] = None
    summary_en: Optional[str] = None
    findings: List[RiskFindingOut]

    class Config:
        from_attributes = True
