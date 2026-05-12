from pydantic import BaseModel
from datetime import date

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    nombre: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str  # "jugador" | "administrador" | "supervisor" | "crupier" | "cajero"

class ForgotPasswordRequest(BaseModel):
    username: str
    new_password: str  # simplified — no email token flow