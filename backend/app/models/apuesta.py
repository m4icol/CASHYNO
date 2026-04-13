from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Apuesta(Base):
    __tablename__ = "apuesta"

    id_apuesta = Column(Integer, primary_key=True, autoincrement=True)
    id_jugador = Column(Integer, ForeignKey("jugador.id_jugador"), nullable=False)
    id_sesion = Column(Integer, ForeignKey("sesion.id_sesion"), nullable=False)
    monto = Column(Integer, nullable=False)
    fecha = Column(DateTime, nullable=False)
    resultado = Column(String(20), nullable=False)

    jugador = relationship("Jugador")
    sesion = relationship("Sesion")