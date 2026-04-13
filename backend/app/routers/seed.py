from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models.rol import Rol
from app.models.empleado import Empleado
from app.models.jugador import Jugador
from app.models.juego import Juego
from app.models.mesa import Mesa
from app.auth import hash_password

router = APIRouter(prefix="/seed", tags=["seed"])

@router.post("/")
def seed(db: Session = Depends(get_db)):
    if db.query(Rol).first():
        return {"message": "Ya hay datos cargados"}

    # Roles
    roles = [
        Rol(nombre="administrador", cargo="Administrador"),
        Rol(nombre="supervisor",    cargo="Supervisor"),
        Rol(nombre="crupier",       cargo="Crupier"),
        Rol(nombre="cajero",        cargo="Cajero"),
    ]
    db.add_all(roles)
    db.flush()

    # Empleados
    empleados = [
        Empleado(nombre="admin",     apellido="Casino",  fecha_nacimiento=date(1990,1,1),
                 fecha_ingreso=date(2020,1,1), id_rol=roles[0].id_rol,
                 estado="ACTIVO", password_hash=hash_password("admin123")),
        Empleado(nombre="supervisor", apellido="Lopez",  fecha_nacimiento=date(1988,5,10),
                 fecha_ingreso=date(2021,3,1), id_rol=roles[1].id_rol,
                 estado="ACTIVO", password_hash=hash_password("super123")),
        Empleado(nombre="crupier",   apellido="Gomez",  fecha_nacimiento=date(1995,7,20),
                 fecha_ingreso=date(2022,6,1), id_rol=roles[2].id_rol,
                 estado="ACTIVO", password_hash=hash_password("crup123")),
    ]
    db.add_all(empleados)

    # Jugadores
    jugadores = [
        Jugador(nombre="juan",  apellido="Perez",  fecha_nacimiento=date(1992,3,15),
                fecha_registro=date(2024,1,1), estado="ACTIVO",
                password_hash=hash_password("juan123")),
        Jugador(nombre="maria", apellido="Torres", fecha_nacimiento=date(1995,8,22),
                fecha_registro=date(2024,2,1), estado="ACTIVO",
                password_hash=hash_password("maria123")),
    ]
    db.add_all(jugadores)

    # Juegos
    juegos = [
        Juego(nombre="Ruleta",    descripcion="Ruleta europea", min_apuesta=5000),
        Juego(nombre="Blackjack", descripcion="21 clásico",     min_apuesta=10000),
        Juego(nombre="Poker",     descripcion="Texas Hold'em",  min_apuesta=20000),
    ]
    db.add_all(juegos)
    db.flush()

    # Mesas
    mesas = [
        Mesa(id_juego=juegos[0].id_juego, min_apuesta=5000,  estado="DISPONIBLE"),
        Mesa(id_juego=juegos[0].id_juego, min_apuesta=10000, estado="OCUPADA"),
        Mesa(id_juego=juegos[1].id_juego, min_apuesta=10000, estado="DISPONIBLE"),
        Mesa(id_juego=juegos[2].id_juego, min_apuesta=20000, estado="MANTENIMIENTO"),
    ]
    db.add_all(mesas)

    db.commit()
    return {"message": "Datos de prueba cargados correctamente"}