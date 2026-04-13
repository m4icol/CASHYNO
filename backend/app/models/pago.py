from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Pago(Base):
    __tablename__ = "pago"

    id_pago = Column(Integer, primary_key=True, autoincrement=True)
    id_premio = Column(Integer, ForeignKey("premio.id_premio"), nullable=False)
    id_jugador = Column(Integer, ForeignKey("jugador.id_jugador"), nullable=False)
    fecha_pago = Column(DateTime, nullable=False)
    estado = Column(String(20), nullable=False, default="PENDIENTE")

    premio = relationship("Premio")
    Jugador = relationship("Jugador")