import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_list_and_get_mutation_cases():
    # 1. List cases
    res = client.get("/api/v1/mutation-cases")
    assert res.status_code == 200
    cases = res.json()
    assert len(cases) >= 1
    sample_case = cases[0]
    case_id = sample_case["id"]

    # 2. Detail view with checklist
    detail_res = client.get(f"/api/v1/mutation-cases/{case_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert len(detail["checklist"]) >= 3
    assert len(detail["events"]) >= 1

def test_mutation_transition_lifecycle():
    # 1. Create a fresh case in SUBMITTED state
    create_res = client.post("/api/v1/mutation-cases", json={
        "parcel_id": "PCL-DH-101",
        "applicant_name": "Test Applicant",
        "applicant_name_bn": "পরীক্ষামূলক আবেদনকারী",
        "remarks": "Initial submission for testing",
    })
    assert create_res.status_code == 201
    case_data = create_res.json()
    case_id = case_data["id"]
    opaque_ref = case_data["opaque_reference"]
    assert case_data["status"] == "SUBMITTED"

    # 2. Test Invalid Transition (Direct SUBMITTED -> COMPLETED should fail)
    invalid_res = client.post(f"/api/v1/mutation-cases/{case_id}/transition", json={
        "to_stage": "COMPLETED",
        "reason": "Direct jump skipping reviews",
    })
    assert invalid_res.status_code == 400
    assert "Invalid transition" in invalid_res.json()["detail"]

    # 3. Test Valid Transition: SUBMITTED -> DOCUMENT_CHECK
    valid_step1 = client.post(f"/api/v1/mutation-cases/{case_id}/transition", json={
        "to_stage": "DOCUMENT_CHECK",
        "reason": "Initial papers checked by clerk",
        "checklist_updates": {"DEED_VERIFIED": True},
    })
    assert valid_step1.status_code == 200
    assert valid_step1.json()["status"] == "DOCUMENT_CHECK"

    # 4. Test Valid Transition: DOCUMENT_CHECK -> OFFICER_REVIEW
    valid_step2 = client.post(f"/api/v1/mutation-cases/{case_id}/transition", json={
        "to_stage": "OFFICER_REVIEW",
        "reason": "Documents verified; forwarded to Assistant Commissioner",
        "checklist_updates": {"KHATIAN_CHAIN_CHECKED": True},
    })
    assert valid_step2.status_code == 200
    assert valid_step2.json()["status"] == "OFFICER_REVIEW"

    # 5. Test Public Tracking (Zero PII)
    public_res = client.get(f"/api/v1/public/mutation-track/{opaque_ref}")
    assert public_res.status_code == 200
    pub_data = public_res.json()
    assert pub_data["status"] == "OFFICER_REVIEW"
    assert pub_data["contains_pii"] is False
    assert "applicant_name" not in pub_data
    assert "Test Applicant" not in pub_data["case_no_masked"]
    assert "সিমুলেটেড" in pub_data["simulation_notice_bn"]
