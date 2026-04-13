from sqlalchemy import Column, Integer, String
from app.database import Base

class Rol(Base):
    __tablename__ = "rol"

    id_rol = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False)
    cargo = Column(String(50), nullable=False)