from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Sesion(Base):
    __tablename__ = "sesion"

    id_sesion = Column(Integer, primary_key=True, autoincrement=True)
    id_mesa = Column(Integer, ForeignKey("mesa.id_mesa"), nullable=False)
    fecha_inicio = Column(DateTime, nullable=False)
    fecha_fin = Column(DateTime)

    mesa = relationship("Mesa")