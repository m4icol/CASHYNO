import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

interface Jugador {
  id_jugador: number
  nombre:     string
  apellido:   string
  estado:     string
  saldo:      number
}

export default function Jugadores() {
  const navigate = useNavigate()
  const nombre   = localStorage.getItem('nombre') ?? 'Admin'

  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(false)
  const [toggling, setToggling]   = useState<number | null>(null)

  useEffect(() => {
    api.get('/jugadores/')
      .then(res => setJugadores(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const toggleEstado = async (jugador: Jugador) => {
    setToggling(jugador.id_jugador)
    try {
      const res = await api.patch(`/jugadores/${jugador.id_jugador}/estado`)
      setJugadores(prev =>
        prev.map(j => j.id_jugador === jugador.id_jugador
          ? { ...j, estado: res.data.estado }
          : j
        )
      )
    } catch {
      console.error('Error al cambiar estado')
    } finally {
      setToggling(null)
    }
  }

  const activos   = jugadores.filter(j => j.estado === 'ACTIVO').length
  const bloqueados = jugadores.filter(j => j.estado === 'BLOQUEADO').length

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🃏</span>
          <div>
            <h1 className="text-foreground text-lg font-bold tracking-[4px] leading-none">CASHYNO</h1>
            <p className="text-muted-foreground text-[11px] mt-0.5">Gestión de Jugadores</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-foreground text-sm font-semibold">{nombre}</p>
            <p className="text-muted-foreground text-xs tracking-widest">ADMINISTRADOR</p>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="border border-border text-muted-foreground text-sm px-4 py-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            ← Volver
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">

        {/* Summary */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Total</p>
              <p className="text-foreground text-2xl font-bold">{jugadores.length}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Activos</p>
              <p className="text-green-500 text-2xl font-bold">{activos}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Bloqueados</p>
              <p className="text-destructive text-2xl font-bold">{bloqueados}</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-foreground text-sm font-semibold tracking-widest uppercase">Jugadores registrados</h2>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground text-sm tracking-widest">Cargando...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-16">
              <p className="text-destructive text-sm">Error al cargar jugadores</p>
            </div>
          )}

          {!loading && !error && jugadores.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <span className="text-4xl">👥</span>
              <p className="text-muted-foreground text-sm tracking-widest">Sin jugadores registrados</p>
            </div>
          )}

          {!loading && !error && jugadores.length > 0 && (
            <div className="divide-y divide-border">
              {jugadores.map(jugador => (
                <div
                  key={jugador.id_jugador}
                  className="flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors"
                >
                  {/* Left — identity */}
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                      jugador.estado === 'ACTIVO'
                        ? 'bg-green-500/15 text-green-500'
                        : 'bg-destructive/15 text-destructive'
                    }`}>
                      {jugador.nombre[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">
                        {jugador.nombre} {jugador.apellido}
                      </p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        ID #{jugador.id_jugador}
                      </p>
                    </div>
                  </div>

                  {/* Right — saldo + estado + action */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs tracking-widest uppercase">Saldo</p>
                      <p className="text-foreground text-sm font-medium">${jugador.saldo.toLocaleString()}</p>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="text-muted-foreground text-xs tracking-widest uppercase">Estado</p>
                      <span className={`text-xs font-bold tracking-widest ${
                        jugador.estado === 'ACTIVO' ? 'text-green-500' : 'text-destructive'
                      }`}>
                        {jugador.estado}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleEstado(jugador)}
                      disabled={toggling === jugador.id_jugador}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer disabled:opacity-40 ${
                        jugador.estado === 'ACTIVO'
                          ? 'border-destructive/40 text-destructive hover:bg-destructive/10'
                          : 'border-green-500/40 text-green-500 hover:bg-green-500/10'
                      }`}
                    >
                      {toggling === jugador.id_jugador
                        ? '...'
                        : jugador.estado === 'ACTIVO' ? 'Bloquear' : 'Desbloquear'
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}