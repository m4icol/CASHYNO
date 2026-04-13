import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import type { TokenResponse } from '../types'

const hints = [
  { u: 'admin',      p: 'admin123', r: 'Administrador' },
  { u: 'supervisor', p: 'super123', r: 'Supervisor'    },
  { u: 'juan',       p: 'juan123',  r: 'Jugador'       },
]

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
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] flex items-center justify-center font-sans">
      <div className="w-[380px] bg-white/5 backdrop-blur-md border border-yellow-400/20 rounded-2xl p-10 shadow-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">♠</div>
          <h1 className="text-yellow-400 text-3xl font-bold tracking-[6px]">CASHYNO</h1>
          <p className="text-white/40 text-sm mt-1">Sistema de Gestión</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-white/70 text-sm font-medium">Usuario</label>
            <input
              className="bg-white/8 border border-yellow-400/30 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-400/70 transition-colors placeholder:text-white/20"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/70 text-sm font-medium">Contraseña</label>
            <input
              className="bg-white/8 border border-yellow-400/30 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-yellow-400/70 transition-colors placeholder:text-white/20"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Hints */}
        <div className="mt-7 pt-5 border-t border-white/10">
          <p className="text-white/30 text-xs text-center mb-3">Usuarios de prueba — click para autocompletar</p>
          <div className="flex flex-col gap-2">
            {hints.map(h => (
              <div
                key={h.u}
                onClick={() => { setUsername(h.u); setPassword(h.p) }}
                className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/4 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <span className="text-yellow-400 text-sm font-semibold">{h.u}</span>
                <span className="text-white/40 text-xs">{h.r}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}