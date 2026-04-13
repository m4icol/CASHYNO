from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class HistorialEstadoJugador(Base):
    __tablename__ = "historial_estado_jugador"

    id_historial = Column(Integer, primary_key=True, autoincrement=True)
    id_jugador = Column(Integer, ForeignKey("jugador.id_jugador"), nullable=False)
    estado_anterior = Column(String(20), nullable=False)
    estado_nuevo = Column(String(20), nullable=False)
    fecha_cambio = Column(DateTime, nullable=False)
    id_empleado = Column(Integer, ForeignKey("empleado.id_empleado"))
    motivo = Column(String(200))

    jugador = relationship("Jugador")
    empleado = relationship("Empleado")