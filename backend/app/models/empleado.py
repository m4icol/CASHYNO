from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Empleado(Base):
    __tablename__ = "empleado"

    id_empleado = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    fecha_ingreso = Column(Date, nullable=False)
    id_rol = Column(Integer, ForeignKey("rol.id_rol"), nullable=False)
    estado = Column(String(20), nullable=False, default="ACTIVO")
    password_hash = Column(String(255), nullable=False)

    rol = relationship("Rol")