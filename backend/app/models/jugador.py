from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class Jugador(Base):
    __tablename__ = "jugador"

    id_jugador = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    fecha_registro = Column(Date, nullable=False)
    estado = Column(String(20), nullable=False, default="ACTIVO")
    password_hash = Column(String(255), nullable=False)