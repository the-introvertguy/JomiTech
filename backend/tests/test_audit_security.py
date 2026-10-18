import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_audit_logs_retrieval_and_safety():
    """Verify audit logs are accessible and contain only safe, redacted metadata."""
    res = client.get("/api/v1/audit-logs?limit=20")
    assert res.status_code == 200
    logs = res.json()
    assert isinstance(logs, list)
    assert len(logs) > 0

    for entry in logs:
        assert "id" in entry
        assert "actor_name" in entry
        assert "actor_role" in entry
        assert "action" in entry
        assert "entity_type" in entry
        assert "entity_id" in entry
        
        # Security: metadata must never contain private keys or password hashes
        if entry.get("metadata_json"):
            meta = entry["metadata_json"].lower()
            assert "private_key" not in meta
            assert "secret" not in meta
            assert "password" not in meta
            assert "argon2" not in meta

def test_public_mutation_tracker_zero_pii():
    """Verify public mutation tracker exposes zero PII (no applicant names or NIDs)."""
    # Use known seeded reference
    res = client.get("/api/v1/public/mutation-track/mut-ref-847291a9b")
    assert res.status_code == 200
    data = res.json()
    
    assert data["contains_pii"] is False
    assert "**" in data["case_no_masked"] # Case number must be masked
    assert "applicant_name" not in data
    assert "applicant_nid" not in data
    assert "applicant_phone" not in data
    assert "simulation_notice_bn" in data
    assert "simulation_notice_en" in data

def test_public_mutation_tracker_not_found():
    """Verify 404 response for unknown tracking reference without leaking info."""
    res = client.get("/api/v1/public/mutation-track/mut-ref-nonexistent-999")
    assert res.status_code == 404
    assert "No mutation record found" in res.json()["detail"]

def test_public_qr_receipt_zero_pii():
    """Verify public QR receipt verification discloses zero citizen PII."""
    res = client.get("/api/v1/public/verify/rcpt-synth-001")
    assert res.status_code == 200
    data = res.json()
    
    assert data["status"] in ["VALID", "REVOKED", "TAMPERED", "EXPIRED", "UNKNOWN"]
    assert "document_sha256" in data
    assert "signature_valid" in data
    assert data["contains_pii"] is False
    # Strict privacy: no names, no NID, no document contents
    assert "owner_name" not in data
    assert "citizen_name" not in data
    assert "nid" not in data
