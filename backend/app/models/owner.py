from sqlalchemy import Column, String
from backend.app.core.database import Base

class Owner(Base):
    __tablename__ = "owners"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_bn = Column(String(100), nullable=False)
    father_name = Column(String(100), nullable=True)
    father_name_bn = Column(String(100), nullable=True)
    synthetic_nid = Column(String(50), nullable=True) # Fictional masked demo identifier only
    address_bn = Column(String(200), nullable=True)
