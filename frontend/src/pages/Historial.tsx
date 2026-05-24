import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import type { HistorialEntry } from '../hooks/useHistorial'

const JUEGO_ICON: Record<string, string> = {
  'Ruleta':   '🎰',
  'BlackJack': '🃏',
}

function formatFecha(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

export default function Historial() {
  const navigate = useNavigate()
  const nombre   = localStorage.getItem('nombre') ?? 'Jugador'

  const [entries, setEntries]   = useState<HistorialEntry[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)

  useEffect(() => {
    api.get('/jugadores/me/historial')
      .then(res => setEntries(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const totalNeto = entries.reduce((acc, e) => acc + e.resultado, 0)
  const ganadas   = entries.filter(e => e.resultado > 0).length
  const perdidas  = entries.filter(e => e.resultado < 0).length

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🃏</span>
          <div>
            <h1 className="text-foreground text-lg font-bold tracking-[4px] leading-none">CASHYNO</h1>
            <p className="text-muted-foreground text-[11px] mt-0.5">Historial</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-foreground text-sm font-semibold">{nombre}</p>
            <p className="text-muted-foreground text-xs tracking-widest">JUGADOR</p>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="border border-border text-muted-foreground text-sm px-4 py-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            ← Volver
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">

        {/* Summary cards */}
        {!loading && !error && entries.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Partidas</p>
              <p className="text-foreground text-2xl font-bold">{entries.length}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Ganadas / Perdidas</p>
              <p className="text-foreground text-2xl font-bold">
                <span className="text-green-500">{ganadas}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className="text-destructive">{perdidas}</span>
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Neto</p>
              <p className={`text-2xl font-bold ${totalNeto >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                {totalNeto >= 0 ? '+' : ''}${totalNeto.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-foreground text-sm font-semibold tracking-widest uppercase">Últimas 50 partidas</h2>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground text-sm tracking-widest">Cargando...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-16">
              <p className="text-destructive text-sm">Error al cargar el historial</p>
            </div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <span className="text-4xl">🎲</span>
              <p className="text-muted-foreground text-sm tracking-widest">Sin partidas aún — ¡juega algo!</p>
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <div className="divide-y divide-border">
              {entries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{JUEGO_ICON[entry.juego] ?? '🎮'}</span>
                    <div>
                      <p className="text-foreground text-sm font-semibold">{entry.juego}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{formatFecha(entry.fecha)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-muted-foreground text-xs tracking-widest uppercase">Apostado</p>
                      <p className="text-foreground text-sm font-medium">${entry.apostado.toLocaleString()}</p>
                    </div>
                    <div className="min-w-[80px]">
                      <p className="text-muted-foreground text-xs tracking-widest uppercase">Resultado</p>
                      <p className={`text-sm font-bold ${entry.resultado > 0 ? 'text-green-500' : 'text-destructive'}`}>
                        {entry.resultado > 0 ? '+' : ''}${entry.resultado.toLocaleString()}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.resultado > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
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