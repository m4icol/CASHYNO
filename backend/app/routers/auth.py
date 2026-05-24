from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.jugador import Jugador
from app.models.empleado import Empleado
from app.schemas.auth import LoginRequest, TokenResponse
from app.auth import verify_password, create_access_token
from app.auth import hash_password
from app.models.rol import Rol
from app.schemas.auth import LoginRequest, TokenResponse, RegisterRequest, ForgotPasswordRequest
from datetime import date

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
        if jugador.estado == "BLOQUEADO":                        # ← agrega esto
            raise HTTPException(status_code=403, detail="Usuario bloqueado")
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

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if data.role == "jugador":
        existing = db.query(Jugador).filter(Jugador.nombre == data.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="El usuario ya existe")
        nuevo = Jugador(
            nombre=data.username,
            apellido="",
            fecha_nacimiento=date(2000, 1, 1),
            fecha_registro=date.today(),
            estado="ACTIVO",
            password_hash=hash_password(data.password)
        )
        db.add(nuevo)
        db.commit()
        return {"message": "Jugador registrado correctamente"}
    else:
        rol = db.query(Rol).filter(Rol.nombre == data.role).first()
        if not rol:
            raise HTTPException(status_code=400, detail="Rol no encontrado")
        existing = db.query(Empleado).filter(Empleado.nombre == data.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="El usuario ya existe")
        nuevo = Empleado(
            nombre=data.username,
            apellido="",
            fecha_nacimiento=date(2000, 1, 1),
            fecha_ingreso=date.today(),
            id_rol=rol.id_rol,
            estado="ACTIVO",
            password_hash=hash_password(data.password)
        )
        db.add(nuevo)
        db.commit()
        return {"message": "Empleado registrado correctamente"}

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    empleado = db.query(Empleado).filter(Empleado.nombre == data.username).first()
    if empleado:
        empleado.password_hash = hash_password(data.new_password)
        db.commit()
        return {"message": "Contraseña actualizada"}
    jugador = db.query(Jugador).filter(Jugador.nombre == data.username).first()
    if jugador:
        jugador.password_hash = hash_password(data.new_password)
        db.commit()
        return {"message": "Contraseña actualizada"}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")