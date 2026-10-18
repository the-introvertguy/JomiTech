from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    actor_id: Optional[str] = None
    actor_name: str
    actor_role: str
    action: str
    entity_type: str
    entity_id: str
    request_ip: Optional[str] = None
    metadata_json: Optional[str] = None
    created_at: datetime
