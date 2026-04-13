# Sistema de Información Casino

Proyecto académico — Pruebas de Software  

---

## Requisitos previos

Tener instalado en el PC:

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/download/)
---

## 1. Clonar el repositorio

```bash
git clone https://github.com/m4icol/CASHYNO
cd casino-system
```

---

## 2. Base de datos (PostgreSQL)

Abrir pgAdmin o psql y crear las dos bases de datos:
Object-Relational Mapping.

```sql
CREATE DATABASE casino_db;
CREATE DATABASE casino_test_db;
```

---

## 3. Backend (FastAPI)

```bash
# Entrar a la carpeta
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### Correr migraciones

```bash
alembic upgrade head
```

### Levantar el servidor

```bash
venv\Scripts\activate
uvicorn app.main:app --reload
```

API disponible en: `http://localhost:8000`  
Documentación Swagger: `http://localhost:8000/docs`

---

## 4. Frontend (React + Vite)

```bash
# Desde la raíz del proyecto, entrar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Levantar el servidor de desarrollo
npm run dev
```

App disponible en: `http://localhost:5173`

---

## 5. Correr las pruebas

```bash
# Estar dentro de /backend con el venv activado

# Todas las pruebas
pytest

# Con reporte de cobertura
pytest --cov=app tests/

# Reporte de cobertura en HTML (se genera carpeta htmlcov/)
pytest --cov=app --cov-report=html tests/

# Solo pruebas unitarias
pytest tests/unit/

# Solo pruebas de integración
pytest tests/integration/
```

---