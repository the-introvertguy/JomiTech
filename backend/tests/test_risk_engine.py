import pytest
from backend.app.core.database import SessionLocal
from backend.app.models.parcel import LandParcel
from backend.ai.risk_rules.engine import evaluate_parcel_risk

@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    yield session
    session.close()

def test_scenario_01_clean_chain(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-101").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.total_score == 0
    assert eval_res.risk_level == "LOW"
    assert len(eval_res.findings) == 0

def test_scenario_02_double_sale(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-502").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level == "HIGH"
    assert eval_res.total_score >= 50
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "POSSIBLE_DOUBLE_SALE" in rule_codes

def test_scenario_03_seller_mismatch(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-703").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level == "HIGH"
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "SELLER_MISMATCH" in rule_codes

def test_scenario_04_duplicate_deed(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-204").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level == "HIGH"
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "DUPLICATE_DEED" in rule_codes

def test_scenario_05_area_share_exceeded(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-605").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level == "HIGH"
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "AREA_OR_SHARE_EXCEEDED" in rule_codes

def test_scenario_06_registered_not_mutated(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-306").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level in ["MEDIUM", "HIGH"]
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "REGISTERED_NOT_MUTATED" in rule_codes

def test_scenario_07_mutation_party_mismatch(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-807").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level in ["MEDIUM", "HIGH"]
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "MUTATION_PARTY_MISMATCH" in rule_codes

def test_scenario_08_impossible_date(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-408").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level in ["MEDIUM", "HIGH"]
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "IMPOSSIBLE_DATE" in rule_codes

def test_scenario_09_khas_indicator(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-909").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level == "HIGH"
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "KHAS_INDICATOR" in rule_codes

def test_scenario_10_survey_chain_gap(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-310").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level in ["MEDIUM", "HIGH"]
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "SURVEY_CHAIN_GAP" in rule_codes

def test_scenario_11_low_ocr_confidence(db):
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-511").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    assert eval_res.risk_level in ["MEDIUM", "HIGH"]
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    assert "LOW_OCR_CONFIDENCE" in rule_codes

def test_scenario_12_valid_co_ownership_no_false_positive(db):
    """
    CRITICAL ACCEPTANCE TEST:
    Benign shared ownership / partial share transfer MUST NOT falsely trigger
    POSSIBLE_DOUBLE_SALE or AREA_OR_SHARE_EXCEEDED!
    """
    parcel = db.query(LandParcel).filter(LandParcel.id == "PCL-DH-901").first()
    assert parcel is not None
    eval_res = evaluate_parcel_risk(parcel, db)
    rule_codes = [f["rule_code"] for f in eval_res.findings]
    
    # Must NOT fire double-sale or share exceeded
    assert "POSSIBLE_DOUBLE_SALE" not in rule_codes
    assert "AREA_OR_SHARE_EXCEEDED" not in rule_codes
    assert eval_res.total_score == 0
    assert eval_res.risk_level == "LOW"
