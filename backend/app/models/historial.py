from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Historial(Base):
    __tablename__ = "historial"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    id_jugador  = Column(Integer, ForeignKey("jugador.id_jugador"), nullable=False)
    juego       = Column(String(50), nullable=False)   # "Ruleta" | "BlackJack"
    apostado    = Column(Numeric(12, 2), nullable=False)
    resultado   = Column(Numeric(12, 2), nullable=False)  # positivo = ganó, negativo = perdió
    fecha       = Column(DateTime, server_default=func.now())