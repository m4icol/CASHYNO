from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.jugador import Jugador
from app.auth import decode_token
from app.models.historial import Historial
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/jugadores", tags=["jugadores"])
bearer = HTTPBearer()

class SaldoUpdate(BaseModel):
    saldo: float

def get_current_jugador(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db)
):
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "jugador":
        raise HTTPException(status_code=401, detail="No autorizado")
    jugador = db.query(Jugador).filter(
        Jugador.id_jugador == int(payload["sub"])
    ).first()
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return jugador

@router.get("/me/saldo")
def get_saldo(jugador: Jugador = Depends(get_current_jugador)):
    return {"saldo": float(jugador.saldo)}

@router.put("/me/saldo")
def update_saldo(
    data: SaldoUpdate,
    jugador: Jugador = Depends(get_current_jugador),
    db: Session = Depends(get_db)
):
    if data.saldo < 0:
        raise HTTPException(status_code=400, detail="Saldo no puede ser negativo")
    jugador.saldo = data.saldo
    db.commit()
    return {"saldo": float(jugador.saldo)}

class HistorialCreate(BaseModel):
    juego:     str
    apostado:  float
    resultado: float  # positivo = ganó, negativo = perdió

class HistorialOut(BaseModel):
    id:        int
    juego:     str
    apostado:  float
    resultado: float
    fecha:     datetime

    class Config:
        from_attributes = True

@router.post("/me/historial")
def crear_historial(
    data: HistorialCreate,
    jugador: Jugador = Depends(get_current_jugador),
    db: Session = Depends(get_db)
):
    entry = Historial(
        id_jugador=jugador.id_jugador,
        juego=data.juego,
        apostado=data.apostado,
        resultado=data.resultado,
    )
    db.add(entry)
    db.commit()
    return {"ok": True}

@router.get("/me/historial", response_model=list[HistorialOut])
def get_historial(
    jugador: Jugador = Depends(get_current_jugador),
    db: Session = Depends(get_db)
):
    return db.query(Historial)\
             .filter(Historial.id_jugador == jugador.id_jugador)\
             .order_by(Historial.fecha.desc())\
             .limit(50)\
             .all()

# Esquema de salida
class JugadorOut(BaseModel):
    id_jugador: int
    nombre:     str
    apellido:   str
    estado:     str
    saldo:      float

    class Config:
        from_attributes = True

# GET — lista todos los jugadores (solo admin)
@router.get("/", response_model=list[JugadorOut])
def get_jugadores(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db)
):
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("role") != "administrador":
        raise HTTPException(status_code=403, detail="Solo administradores")
    return db.query(Jugador).order_by(Jugador.id_jugador).all()

# PATCH — bloquear o desbloquear
@router.patch("/{id_jugador}/estado")
def cambiar_estado(
    id_jugador: int,
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db)
):
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("role") != "administrador":
        raise HTTPException(status_code=403, detail="Solo administradores")
    jugador = db.query(Jugador).filter(Jugador.id_jugador == id_jugador).first()
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    jugador.estado = "BLOQUEADO" if jugador.estado == "ACTIVO" else "ACTIVO"
    db.commit()
    return {"id_jugador": jugador.id_jugador, "estado": jugador.estado}