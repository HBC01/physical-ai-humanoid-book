from sqlalchemy import Column, String, JSON
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hardware_config = Column(JSON, nullable=True)
    software_stack = Column(JSON, nullable=True)
