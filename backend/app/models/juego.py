from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Juego(Base):
    __tablename__ = "juego"
    
    id_juego = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255))
    min_apuesta = Column(Integer, nullable=False)