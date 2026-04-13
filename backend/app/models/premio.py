from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Premio(Base):
    __tablename__ = "premio"

    id_premio = Column(Integer, primary_key=True, autoincrement=True)
    id_apuesta = Column(Integer, ForeignKey("apuesta.id_apuesta"), nullable=False)
    id_empleado = Column(Integer, ForeignKey("empleado.id_empleado"), nullable=False)
    monto_premio = Column(Integer, nullable=False)
    min_jugadores = Column(Integer, nullable=False)

    relationship("Apuesta")
    relationship("Empleado")