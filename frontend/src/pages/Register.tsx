import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

const ROLES = [
  { value: 'jugador',       label: 'Jugador'       },
  { value: 'administrador', label: 'Administrador' },
]

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [role, setRole]         = useState('jugador')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 6)  { setError('La contraseña debe tener al menos 6 caracteres'); return }
    if (!username.trim())     { setError('El usuario no puede estar vacío'); return }

    setLoading(true)
    try {
      await api.post('/auth/register', { username, password, role })
      setSuccess('Usuario creado correctamente')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? 'Error al crear el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-sans">
      <div className="w-[400px] bg-card border border-border rounded-2xl p-10 shadow-xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🃏</div>
          <h1 className="text-foreground text-3xl font-black tracking-[6px]">CASHYNO</h1>
          <p className="text-muted-foreground text-sm mt-1">Crear cuenta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-foreground text-sm font-medium">Usuario</label>
            <input
              className="bg-input border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Elige un nombre de usuario"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-foreground text-sm font-medium">Contraseña</label>
            <input
              type="password"
              className="bg-input border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-foreground text-sm font-medium">Confirmar contraseña</label>
            <input
              type="password"
              className="bg-input border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          {/* Role selector */}
          <div className="flex flex-col gap-2">
            <label className="text-foreground text-sm font-medium">Rol</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    role === r.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-ring hover:text-foreground'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {error   && <p className="text-destructive text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-6 pt-5 border-t border-border text-center">
          <p className="text-muted-foreground text-xs">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:opacity-80 transition-opacity">
              Inicia sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}