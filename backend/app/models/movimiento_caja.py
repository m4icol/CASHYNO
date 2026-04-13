from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class MovimientoCaja(Base):
    __tablename__ = "movimiento_caja"

    id_movimiento = Column(Integer, primary_key=True, autoincrement=True)
    id_empleado = Column(Integer, ForeignKey("empleado.id_empleado"), nullable=False)
    tipo_movimiento = Column(String(50), nullable=False)
    monto = Column(Integer, nullable=False)
    fecha = Column(DateTime, nullable=False)
    descripcion = Column(String(200))

    empleado = relationship("Empleado")