import io
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_document_upload_and_extraction_pipeline():
    # 1. Create a dummy test synthetic deed file in memory
    synthetic_deed_content = (
        b"Government of Bangladesh\n"
        b"Sub-Registry Office: Tejgaon, Dhaka\n"
        b"Deed No: 7788/2024\n"
        b"Date: 2024-05-15\n"
        b"Khatian No: 410\n"
        b"Dag No: 815\n"
        b"Area: 10.0 decimal\n"
        b"Vendor: Md. Tareq Hasan\n"
        b"Purchaser: Md. Rafiqul Alam\n"
        b"Registered and Sealed.\n"
    )

    file_obj = io.BytesIO(synthetic_deed_content)
    
    # 2. Upload Document
    upload_res = client.post(
        "/api/v1/documents",
        files={"file": ("test_synthetic_deed.pdf", file_obj, "application/pdf")},
    )
    assert upload_res.status_code == 201
    doc_data = upload_res.json()
    assert doc_data["id"].startswith("DOC-")
    assert "sha256_hash" in doc_data
    doc_id = doc_data["id"]

    # 3. Trigger OCR Extraction
    extract_res = client.post(f"/api/v1/documents/{doc_id}/extract")
    assert extract_res.status_code == 200
    job_data = extract_res.json()
    assert job_data["document_id"] == doc_id
    assert job_data["status"] == "PENDING_REVIEW"
    assert len(job_data["fields"]) >= 4
    job_id = job_data["id"]

    # 4. Review Queue inspection
    queue_res = client.get("/api/v1/review-queue")
    assert queue_res.status_code == 200
    queue_jobs = queue_res.json()
    assert any(j["id"] == job_id for j in queue_jobs)

    # 5. Reviewer corrects a field (PATCH)
    correction_res = client.patch(
        f"/api/v1/extractions/{job_id}",
        json=[{"field_name": "deed_no", "reviewer_value": "7788/2024 (Verified)"}],
    )
    assert correction_res.status_code == 200
    corrected_job = correction_res.json()
    corrected_field = next(f for f in corrected_job["fields"] if f["field_name"] == "deed_no")
    assert corrected_field["reviewer_value"] == "7788/2024 (Verified)"
    assert corrected_field["is_verified"] == True

    # 6. Approve Extraction Job
    approve_res = client.post(f"/api/v1/extractions/{job_id}/approve")
    assert approve_res.status_code == 200
    approved_job = approve_res.json()
    assert approved_job["status"] == "APPROVED"
    assert approved_job["document"]["status"] == "APPROVED"

    # 7. Verify Copy (Exact Match)
    verify_match_res = client.post(
        f"/api/v1/documents/{doc_id}/verify-copy",
        files={"file": ("exact_copy.pdf", io.BytesIO(synthetic_deed_content), "application/pdf")},
    )
    assert verify_match_res.status_code == 200
    match_data = verify_match_res.json()
    assert match_data["exact_match"] == True
    assert match_data["status"] == "VALID_BYTE_MATCH"

    # 8. Verify Copy (Altered File Mismatch)
    altered_content = synthetic_deed_content + b" [tampered extra bytes]"
    verify_mismatch_res = client.post(
        f"/api/v1/documents/{doc_id}/verify-copy",
        files={"file": ("tampered_copy.pdf", io.BytesIO(altered_content), "application/pdf")},
    )
    assert verify_mismatch_res.status_code == 200
    mismatch_data = verify_mismatch_res.json()
    assert mismatch_data["exact_match"] == False
    assert mismatch_data["status"] == "HASH_MISMATCH"

def test_rejection_workflow():
    file_bytes = b"Some flawed test deed\n"
    upload_res = client.post(
        "/api/v1/documents",
        files={"file": ("flawed_deed.pdf", io.BytesIO(file_bytes), "application/pdf")},
    )
    doc_id = upload_res.json()["id"]

    extract_res = client.post(f"/api/v1/documents/{doc_id}/extract")
    job_id = extract_res.json()["id"]

    # Reject with reason
    reject_res = client.post(
        f"/api/v1/extractions/{job_id}/reject",
        json={"reason": "Unreadable blurred registration seal; volume page mismatch"},
    )
    assert reject_res.status_code == 200
    rejected_job = reject_res.json()
    assert rejected_job["status"] == "REJECTED"
    assert "Unreadable" in rejected_job["rejection_reason"]
