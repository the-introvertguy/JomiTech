from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(String(50), primary_key=True, index=True)
    parcel_id = Column(String(50), ForeignKey("land_parcels.id"), nullable=False, index=True)
    total_score = Column(Integer, default=0) # 0 - 100
    risk_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH
    rule_version = Column(String(20), default="v2.0-deterministic")
    assessed_at = Column(DateTime, default=datetime.utcnow)
    summary_bn = Column(Text, nullable=True)
    summary_en = Column(Text, nullable=True)

    # Relationships
    parcel = relationship("LandParcel")
    findings = relationship("RiskFinding", back_populates="assessment", cascade="all, delete-orphan")


class RiskFinding(Base):
    __tablename__ = "risk_findings"

    id = Column(String(50), primary_key=True, index=True)
    assessment_id = Column(String(50), ForeignKey("risk_assessments.id"), nullable=False, index=True)
    rule_code = Column(String(50), nullable=False, index=True)
    severity = Column(String(20), nullable=False) # LOW, MEDIUM, HIGH
    score_contribution = Column(Integer, default=0)
    title_bn = Column(String(200), nullable=False)
    title_en = Column(String(200), nullable=False)
    evidence_json = Column(Text, nullable=False) # Serialized JSON with conflicting deed refs, dag numbers, owners, dates
    recommended_action_bn = Column(Text, nullable=False)
    recommended_action_en = Column(Text, nullable=False)
    limitation_notice_bn = Column(Text, nullable=False)
    limitation_notice_en = Column(Text, nullable=False)

    # Relationships
    assessment = relationship("RiskAssessment", back_populates="findings")
