import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBalance } from '../hooks/useBalance'
import { CartaUI } from '@/components/Card'
import { useHistorial } from '@/hooks/useHistorial'



// ─── Types ────────────────────────────────────────────────────────────────────
export type Palo  = '♠' | '♥' | '♦' | '♣'
export type Valor = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
export type Fase      = 'esperando' | 'jugando' | 'terminado'
export type Resultado = 'victoria' | 'derrota' | 'empate' | 'blackjack' | null

export interface Carta { palo: Palo; valor: Valor; oculta?: boolean }

// ─── Constants ────────────────────────────────────────────────────────────────
const PALOS:  Palo[]  = ['♠', '♥', '♦', '♣']
const VALORES: Valor[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
const CHIPS = [1000, 5000, 10000, 50000]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function crearBaraja(): Carta[] {
  const baraja: Carta[] = []
  for (const palo of PALOS)
    for (const valor of VALORES)
      baraja.push({ palo, valor })
    
  for (let i = baraja.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [baraja[i], baraja[j]] = [baraja[j], baraja[i]]
  }
  return baraja
}

export function valorCarta(v: Valor): number {
  if (v === 'A') return 11
  if (['J','Q','K'].includes(v)) return 10
  return parseInt(v)
}

export function calcularMano(mano: Carta[]): number {
  let total = 0
  let ases  = 0
  for (const c of mano) {
    if (c.oculta) continue
    total += valorCarta(c.valor)
    if (c.valor === 'A') ases++
  }
  while (total > 21 && ases > 0) { total -= 10; ases-- }
  return total
}

export function esRoja(palo: Palo): boolean {
  return palo === '♥' || palo === '♦'
}

export function esBlackjack(mano: Carta[]): boolean {
  return mano.length === 2 && calcularMano(mano) === 21
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BlackJack() {
  const { registrar } = useHistorial()
  const navigate = useNavigate()
  const nombre   = localStorage.getItem('nombre') ?? 'Jugador'

  const { balance, updateBalance } = useBalance()

  const [apuesta, setApuesta]         = useState(1000)
  const [baraja, setBaraja]           = useState<Carta[]>([])
  const [manoJugador, setManoJugador] = useState<Carta[]>([])
  const [manoCasa, setManoCasa]       = useState<Carta[]>([])
  const [fase, setFase]               = useState<Fase>('esperando')
  const [resultado, setResultado]     = useState<Resultado>(null)
  const [mensaje, setMensaje]         = useState<string>('')
  const [deltaBalance, setDeltaBalance] = useState<number>(0)

  // useRef guard — prevents double-click race on "Pedir"
  const pidiendo = useRef(false)
  // Snapshot of balance at round start — prevents stale closures in async callbacks
  const balanceAlIniciar = useRef(balance)

  // ── Start round ──────────────────────────────────────────────────────────────
  const iniciar = useCallback(() => {
    if (apuesta > balance) return

    const nuevoBalance = balance - apuesta
    updateBalance(nuevoBalance)
    balanceAlIniciar.current = nuevoBalance   // snapshot after deduction

    const b  = crearBaraja()
    const j1 = b.shift()!
    const c1 = b.shift()!
    const j2 = b.shift()!
    const c2 = { ...b.shift()!, oculta: true }
    const mj = [j1, j2]
    const mc = [c1, c2]

    setBaraja(b)
    setManoJugador(mj)
    setManoCasa(mc)
    setResultado(null)
    setMensaje('')
    setDeltaBalance(0)

if (esBlackjack(mj)) {
  const mc2 = mc.map(c => ({ ...c, oculta: false }))
  setManoCasa(mc2)
  
  if (esBlackjack(mc2)) {
    updateBalance(nuevoBalance + apuesta)
    setDeltaBalance(0)
    setResultado('empate')
    setMensaje('¡Empate! Los dos con Blackjack')
    registrar('BlackJack', apuesta, 0)                        // ← agrega
  } else {
    const ganancia = Math.floor(apuesta * 2.5)
    updateBalance(nuevoBalance + ganancia)
    setDeltaBalance(ganancia - apuesta)
    setResultado('blackjack')
    setMensaje('¡BLACKJACK! Pago 3:2 🎉')
    registrar('BlackJack', apuesta, ganancia - apuesta)       // ← agrega
  }
  
  setFase('terminado')
  return
}

    setFase('jugando')
  }, [apuesta, balance, updateBalance])

  // ── House logic — receives explicit params to avoid stale closures ───────────
  const plantarseConMano = useCallback((
    mj:          Carta[],
    barajaActual: Carta[],
    manoC:       Carta[],
  ) => {
    let mc = manoC.map(c => ({ ...c, oculta: false }))
    let b  = [...barajaActual]

    while (calcularMano(mc) < 17) {
      const [carta, ...resto] = b
      mc = [...mc, carta]
      b  = resto
    }

    const totalJ = calcularMano(mj)
    const totalC = calcularMano(mc)
    setManoCasa(mc)
    setBaraja(b)

    // Balance was already debited on iniciar — we only add money back on win/push
    const base = balanceAlIniciar.current

    if (totalC > 21 || totalJ > totalC) {
      const ganancia = apuesta * 2
      updateBalance(base + ganancia)
      setDeltaBalance(apuesta)
      setResultado('victoria')
      setMensaje(totalC > 21
        ? `¡Casa se pasó! (${totalC}) Ganaste 🏆`
        : `Ganaste! ${totalJ} vs ${totalC} 🏆`)
      registrar('BlackJack', apuesta, apuesta) 
    } else if (totalJ < totalC) {
      // Already debited — nothing more to do
      setDeltaBalance(-apuesta)
      setResultado('derrota')
      setMensaje(`Perdiste. ${totalJ} vs ${totalC} 😞`)
      registrar('BlackJack', apuesta, -apuesta) 
    } else {
      // Push — refund bet
      updateBalance(base + apuesta)
      setDeltaBalance(0)
      setResultado('empate')
      setMensaje(`Empate! ${totalJ} vs ${totalC} 🤝`)
      registrar('BlackJack', apuesta, 0)
    }

    setFase('terminado')
  }, [apuesta, updateBalance])

  // ── Hit ───────────────────────────────────────────────────────────────────────
const pedir = useCallback(() => {
  if (fase !== 'jugando' || pidiendo.current) return
  pidiendo.current = true

  setTimeout(() => {
    const [carta, ...resto] = baraja          // read from ref/state directly
    const nuevaMano = [...manoJugador, carta]
    const total = calcularMano(nuevaMano)

    setBaraja(resto)
    setManoJugador(nuevaMano)

    if (total > 21) {
      setManoCasa(mc => mc.map(c => ({ ...c, oculta: false })))
      setDeltaBalance(-apuesta)
      setResultado('derrota')
      setMensaje(`Te pasaste con ${total} 💀`)
      setFase('terminado')
      registrar('BlackJack', apuesta, -apuesta)
    } else if (total === 21) {
      plantarseConMano(nuevaMano, resto, manoCasa)
    }

    pidiendo.current = false
  }, 200)
}, [fase, apuesta, baraja, manoJugador, manoCasa, plantarseConMano])

  // ── Stand ─────────────────────────────────────────────────────────────────────
  const plantarse = useCallback(() => {
    if (fase !== 'jugando') return
    plantarseConMano(manoJugador, baraja, manoCasa)
  }, [fase, manoJugador, baraja, manoCasa, plantarseConMano])

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const colorResultado = () => {
    if (resultado === 'victoria' || resultado === 'blackjack') return 'text-green-500'
    if (resultado === 'derrota') return 'text-red-500'
    return 'text-yellow-400'
  }

  const totalJugador = calcularMano(manoJugador)
  const totalCasa    = calcularMano(manoCasa.filter(c => !c.oculta))

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes cartaEntrada {
          from { opacity: 0; transform: translateY(-20px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .carta-entrada { animation: cartaEntrada 0.28s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div className="min-h-screen bg-background flex flex-col font-sans">

        {/* Header */}
        <header className="flex justify-between items-center px-8 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🃏</span>
            <div>
              <h1 className="text-foreground text-lg font-bold tracking-[4px] leading-none">CASHYNO</h1>
              <p className="text-muted-foreground text-[11px] mt-0.5">Black Jack</p>
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

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-8">

          {/* Balance + result delta */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Balance</p>
              <p className="text-foreground text-3xl font-bold">${balance.toLocaleString()}</p>
            </div>
            {resultado && (
              <div className="text-center">
                <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">
                  {resultado === 'victoria' || resultado === 'blackjack'
                    ? 'Ganaste'
                    : resultado === 'derrota'
                    ? 'Perdiste'
                    : 'Resultado'}
                </p>
                <p className={`text-3xl font-bold ${colorResultado()}`}>
                  {deltaBalance > 0
                    ? `+$${deltaBalance.toLocaleString()}`
                    : deltaBalance < 0
                    ? `-$${Math.abs(deltaBalance).toLocaleString()}`
                    : '±$0'}
                </p>
              </div>
            )}
          </div>

          {/* Table */}
          <div
            className="w-full max-w-2xl rounded-2xl border border-border p-6 flex flex-col gap-6"
            style={{ background: 'var(--card)' }}
          >
            {/* House hand */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Casa{fase !== 'esperando'
                  ? ` — ${totalCasa}${manoCasa.some(c => c.oculta) ? '+?' : ''}`
                  : ''}
              </p>
              <div className="flex gap-2 min-h-[100px] items-center justify-center flex-wrap">
                {manoCasa.length === 0
                  ? <span className="text-muted-foreground text-sm opacity-40">— sin cartas —</span>
                  : manoCasa.map((c, i) => <CartaUI key={i} carta={c} animado={i === manoCasa.length - 1} />)
                }
              </div>
            </div>

            <div className="border-t border-border opacity-40" />

            {/* Player hand */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground text-xs tracking-widest uppercase">
                Tú{fase !== 'esperando' ? ` — ${totalJugador}` : ''}
                {totalJugador > 21 ? ' 💀' : totalJugador === 21 ? ' 🔥' : ''}
              </p>
              <div className="flex gap-2 min-h-[100px] items-center justify-center flex-wrap">
                {manoJugador.length === 0
                  ? <span className="text-muted-foreground text-sm opacity-40">— sin cartas —</span>
                  : manoJugador.map((c, i) => <CartaUI key={i} carta={c} animado={i === manoJugador.length - 1} />)
                }
              </div>
            </div>
          </div>

          {/* Result message */}
          <div className="h-8 flex items-center justify-center">
            {mensaje
              ? <p className={`text-base font-semibold tracking-wide ${colorResultado()}`}>{mensaje}</p>
              : fase === 'esperando'
                ? <p className="text-muted-foreground text-sm tracking-widest uppercase">elige tu apuesta y juega</p>
                : null
            }
          </div>

          {/* Chips */}
          <div className="flex gap-2 flex-wrap justify-center">
            {CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => setApuesta(chip)}
                disabled={fase === 'jugando'}
                className={`w-16 h-16 rounded-full text-sm font-bold border-2 transition-all cursor-pointer disabled:opacity-40 ${
                  apuesta === chip
                    ? 'bg-primary text-primary-foreground border-primary scale-110'
                    : 'bg-card text-foreground border-border hover:border-primary'
                }`}
              >
                ${chip >= 1000 ? `${chip / 1000}K` : chip}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap justify-center">
            {fase === 'esperando' || fase === 'terminado' ? (
              <button
                onClick={iniciar}
                disabled={apuesta > balance}
                className="px-12 py-4 bg-primary text-primary-foreground font-bold tracking-[4px] uppercase rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                {fase === 'terminado' ? 'Jugar de Nuevo' : `Apostar $${apuesta.toLocaleString()}`}
              </button>
            ) : (
              <>
                <button
                  onClick={pedir}
                  className="px-10 py-4 bg-primary text-primary-foreground font-bold tracking-[4px] uppercase rounded-xl text-sm hover:opacity-90 transition-all cursor-pointer"
                >
                  Pedir
                </button>
                <button
                  onClick={plantarse}
                  className="px-10 py-4 border border-border text-foreground font-bold tracking-[4px] uppercase rounded-xl text-sm hover:bg-accent transition-all cursor-pointer"
                >
                  Plantarse
                </button>
              </>
            )}
          </div>

          {balance <= 0 && fase !== 'jugando' && (
            <p className="text-destructive text-sm tracking-widest">Sin fondos — recarga tu cuenta</p>
          )}

        </main>
      </div>
    </>
  )
}