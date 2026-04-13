from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.jugador import Jugador
from app.models.empleado import Empleado
from app.schemas.auth import LoginRequest, TokenResponse
from app.auth import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # Buscar primero en empleados
    empleado = db.query(Empleado).filter(
        Empleado.nombre == data.username
    ).first()

    if empleado and verify_password(data.password, empleado.password_hash):
        token = create_access_token({
            "sub": str(empleado.id_empleado),
            "role": empleado.rol.nombre,
            "type": "empleado"
        })
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": empleado.rol.nombre,
            "nombre": f"{empleado.nombre} {empleado.apellido}"
        }

    # Buscar en jugadores
    jugador = db.query(Jugador).filter(
        Jugador.nombre == data.username
    ).first()

    if jugador and verify_password(data.password, jugador.password_hash):
        token = create_access_token({
            "sub": str(jugador.id_jugador),
            "role": "jugador",
            "type": "jugador"
        })
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": "jugador",
            "nombre": f"{jugador.nombre} {jugador.apellido}"
        }

    raise HTTPException(status_code=401, detail="Credenciales incorrectas")