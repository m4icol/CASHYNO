from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Mesa(Base):
    __tablename__ = "mesa"

    id_mesa = Column(Integer, primary_key=True, autoincrement=True)
    id_juego = Column(Integer, ForeignKey("juego.id_juego"), nullable=False)
    min_apuesta = Column(Integer, nullable=False)
    estado = Column(String(20), nullable=False, default="DISPONIBLE")

    juego = relationship("Juego")