from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.audit import AuditLog
from backend.app.schemas.audit import AuditLogOut

router = APIRouter(tags=["Audit Logs"])

@router.get("/audit-logs", response_model=List[AuditLogOut])
def list_audit_logs(
    action: Optional[str] = Query(None, description="Filter by action code"),
    actor_role: Optional[str] = Query(None, description="Filter by actor role"),
    entity_type: Optional[str] = Query(None, description="Filter by entity type"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Retrieve immutable audit trail with safe metadata."""
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action == action)
    if actor_role:
        query = query.filter(AuditLog.actor_role == actor_role)
    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)
    
    return query.order_by(AuditLog.created_at.desc()).limit(limit).all()
