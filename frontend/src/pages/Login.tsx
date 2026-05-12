import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import type { TokenResponse } from '../types'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  // Forgot password
  const [showForgot, setShowForgot] = useState(false)
  const [fpUsername, setFpUsername] = useState('')
  const [fpNew, setFpNew]           = useState('')
  const [fpConfirm, setFpConfirm]   = useState('')
  const [fpError, setFpError]       = useState('')
  const [fpSuccess, setFpSuccess]   = useState('')
  const [fpLoading, setFpLoading]   = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post<TokenResponse>('/auth/login', { username, password })
      localStorage.setItem('token',  res.data.access_token)
      localStorage.setItem('role',   res.data.role)
      localStorage.setItem('nombre', res.data.nombre)
      navigate('/menu')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setFpError('')
    setFpSuccess('')
    if (fpNew !== fpConfirm) { setFpError('Las contraseñas no coinciden'); return }
    if (fpNew.length < 6)    { setFpError('Mínimo 6 caracteres'); return }
    setFpLoading(true)
    try {
      await api.post('/auth/forgot-password', { username: fpUsername, new_password: fpNew })
      setFpSuccess('Contraseña actualizada correctamente')
      setFpUsername(''); setFpNew(''); setFpConfirm('')
      setTimeout(() => { setShowForgot(false); setFpSuccess('') }, 2000)
    } catch {
      setFpError('Usuario no encontrado')
    } finally {
      setFpLoading(false)
    }
  }

  const closeForgot = () => { setShowForgot(false); setFpError(''); setFpSuccess('') }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-sans">

      {/* Forgot password modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-[360px] bg-card border border-border rounded-2xl p-8 shadow-xl">
            <h2 className="text-foreground text-lg font-black tracking-widest text-center mb-1">RESTABLECER</h2>
            <p className="text-muted-foreground text-xs text-center mb-6">Ingresa tu usuario y una nueva contraseña</p>

            <form onSubmit={handleForgot} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-foreground text-sm font-medium">Usuario</label>
                <input
                  className="bg-input border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
                  value={fpUsername}
                  onChange={e => setFpUsername(e.target.value)}
                  placeholder="Tu nombre de usuario"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-foreground text-sm font-medium">Nueva contraseña</label>
                <input
                  type="password"
                  className="bg-input border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
                  value={fpNew}
                  onChange={e => setFpNew(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-foreground text-sm font-medium">Confirmar contraseña</label>
                <input
                  type="password"
                  className="bg-input border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
                  value={fpConfirm}
                  onChange={e => setFpConfirm(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  required
                />
              </div>

              {fpError   && <p className="text-destructive text-sm text-center">{fpError}</p>}
              {fpSuccess && <p className="text-green-500 text-sm text-center">{fpSuccess}</p>}

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={closeForgot}
                  className="flex-1 border border-border text-muted-foreground py-3 rounded-lg text-sm hover:bg-secondary transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={fpLoading}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {fpLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login card */}
      <div className="w-[380px] bg-card border border-border rounded-2xl p-10 shadow-xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🃏</div>
          <h1 className="text-foreground text-3xl font-black tracking-[6px]">CASHYNO</h1>
          <p className="text-muted-foreground text-sm mt-1">Sistema de Gestión</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-foreground text-sm font-medium">Usuario</label>
            <input
              className="bg-input border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-foreground text-sm font-medium">Contraseña</label>
            </div>
            <input
              className="bg-input border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-muted-foreground text-xs hover:text-foreground transition-colors cursor-pointer mt-3"
              >
                ¿Olvidaste tu contraseña?
              </button>
          </div>

          {error && <p className="text-destructive text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-6 pt-5 border-t border-border text-center">
          <p className="text-muted-foreground text-xs">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:opacity-80 transition-opacity">
              Regístrate
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}