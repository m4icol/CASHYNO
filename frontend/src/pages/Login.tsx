import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import type { TokenResponse } from '../types'
import { hints } from '@/types/hints'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-sans">
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
            <label className="text-foreground text-sm font-medium">Contraseña</label>
            <input
              className="bg-input border border-border rounded-lg px-4 py-3 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-primary text-primary-foreground font-bold py-3 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Hints */}
        <div className="mt-7 pt-5 border-t border-border">
          <p className="text-muted-foreground text-xs text-center mb-3">Usuarios de prueba — click para autocompletar</p>
          <div className="flex flex-col gap-2">
            {hints.map(h => (
              <div
                key={h.u}
                onClick={() => { setUsername(h.u); setPassword(h.p) }}
                className="flex justify-between items-center px-3 py-2 rounded-lg bg-secondary hover:bg-accent cursor-pointer transition-colors"
              >
                <span className="text-secondary-foreground text-sm font-semibold">{h.u}</span>
                <span className="text-muted-foreground text-xs">{h.r}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}