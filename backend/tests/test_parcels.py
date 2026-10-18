import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

def test_search_all_parcels():
    response = client.get("/api/v1/parcels")
    assert response.status_code == 200
    parcels = response.json()
    assert len(parcels) >= 12

def test_search_by_dag():
    # Search for Dag 502 (Double Sale)
    response = client.get("/api/v1/parcels?q=502")
    assert response.status_code == 200
    parcels = response.json()
    assert len(parcels) >= 1
    assert any(p["dag_no"] == "502" for p in parcels)

def test_parcel_detail_clean():
    # Scenario 1 (Clean Chain): PCL-DH-101
    response = client.get("/api/v1/parcels/PCL-DH-101")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "PCL-DH-101"
    assert data["risk_score"] == 0
    assert data["risk_level"] == "LOW"
    assert len(data["khatians"]) == 4 # CS, SA, RS, BS

def test_parcel_detail_double_sale():
    # Scenario 2 (Double Sale): PCL-DH-502
    response = client.get("/api/v1/parcels/PCL-DH-502")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "PCL-DH-502"
    assert data["risk_score"] == 65
    assert data["risk_level"] == "HIGH"
    assert len(data["transfers"]) == 2 # Two transfers in 14 days

def test_parcel_risk_findings():
    response = client.get("/api/v1/parcels/PCL-DH-502/risk")
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "HIGH"
    assert len(data["findings"]) >= 1
    finding = data["findings"][0]
    assert finding["rule_code"] == "POSSIBLE_DOUBLE_SALE"
    assert "conflicting_deeds" in finding["evidence_data"]

def test_auth_login():
    response = client.post("/api/v1/auth/login", json={
        "email": "tareq.citizen@example.com",
        "password": "jomitech2026"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "citizen"

def test_auth_demo_switch():
    response = client.post("/api/v1/auth/demo-switch/officer")
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "officer"
