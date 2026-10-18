from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.api.deps import get_db
from backend.app.core.config import settings

router = APIRouter(tags=["health"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    return {
        "status": "healthy" if db_ok else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected" if db_ok else "disconnected",
        "active_key_id": settings.ACTIVE_KEY_ID,
        "demo_mode": settings.DEMO_MODE,
        "notice": "ডেমো ডেটা — সরকারি রেকর্ড নয় / Demo data — not an official government record",
    }
