import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.crypto import sign_receipt_payload, verify_receipt_signature
from backend.app.core.database import SessionLocal
from backend.app.models.document import Document
from backend.app.models.receipt import VerificationReceipt

client = TestClient(app)

def test_ed25519_crypto_sign_and_verify():
    opaque_id = "rcp-test-uuid-12345"
    sha256_hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    issued_at = datetime.utcnow()
    key_id = "ed25519-jomitech-2026-v1"

    # 1. Sign
    sig = sign_receipt_payload(opaque_id, sha256_hash, issued_at, key_id)
    assert isinstance(sig, str)
    assert len(sig) == 128 # 64 bytes in hex

    # 2. Verify valid
    assert verify_receipt_signature(opaque_id, sha256_hash, issued_at, key_id, sig) is True

    # 3. Verify tampered hash fails
    assert verify_receipt_signature(opaque_id, "tampered_hash_value", issued_at, key_id, sig) is False

    # 4. Verify altered timestamp fails
    assert verify_receipt_signature(opaque_id, sha256_hash, datetime(2020, 1, 1), key_id, sig) is False

def test_issue_and_verify_receipt_api():
    # Retrieve a seeded approved document
    db = SessionLocal()
    doc = db.query(Document).filter(Document.status == "APPROVED").first()
    assert doc is not None, "Need at least one approved document in seed"
    doc_id = doc.id
    db.close()

    # 1. Issue Receipt
    issue_res = client.post("/api/v1/receipts", json={"document_id": doc_id})
    assert issue_res.status_code == 201
    receipt_data = issue_res.json()
    assert "opaque_id" in receipt_data
    opaque_id = receipt_data["opaque_id"]
    receipt_id = receipt_data["id"]

    # 2. Public Verification (Valid)
    verify_res = client.get(f"/api/v1/public/verify/{opaque_id}")
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert v_data["status"] == "VALID"
    assert v_data["sha256_match"] is True
    assert v_data["signature_valid"] is True
    assert v_data["contains_pii"] is False
    # Ensure no owner names or personal identifiers exist in response
    assert "owner" not in v_data
    assert "name" not in v_data

    # 3. Public Verification (Unknown ID)
    unknown_res = client.get("/api/v1/public/verify/rcp-nonexistent-unknown-id")
    assert unknown_res.status_code == 200
    u_data = unknown_res.json()
    assert u_data["status"] == "UNKNOWN"

    # 4. Revocation
    revoke_res = client.post(
        f"/api/v1/receipts/{receipt_id}/revoke",
        json={"reason": "Clerical volume index correction by sub-registrar"},
    )
    assert revoke_res.status_code == 200
    assert revoke_res.json()["is_revoked"] is True

    # 5. Public Verification After Revocation
    revoked_verify = client.get(f"/api/v1/public/verify/{opaque_id}")
    assert revoked_verify.status_code == 200
    assert revoked_verify.json()["status"] == "REVOKED"
