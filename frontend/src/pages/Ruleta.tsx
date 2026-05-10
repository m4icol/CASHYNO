import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBalance } from '../hooks/useBalance'

// ─── Constants ────────────────────────────────────────────────────────────────
const NUMBERS = [
  { n: 0,  c: 'green'  },
  { n: 32, c: 'red'    }, { n: 15, c: 'black'  }, { n: 19, c: 'red'    },
  { n: 4,  c: 'black'  }, { n: 21, c: 'red'    }, { n: 2,  c: 'black'  },
  { n: 25, c: 'red'    }, { n: 17, c: 'black'  }, { n: 34, c: 'red'    },
  { n: 6,  c: 'black'  }, { n: 27, c: 'red'    }, { n: 13, c: 'black'  },
  { n: 36, c: 'red'    }, { n: 11, c: 'black'  }, { n: 30, c: 'red'    },
  { n: 8,  c: 'black'  }, { n: 23, c: 'red'    }, { n: 10, c: 'black'  },
  { n: 5,  c: 'red'    }, { n: 24, c: 'black'  }, { n: 16, c: 'red'    },
  { n: 33, c: 'black'  }, { n: 1,  c: 'red'    }, { n: 20, c: 'black'  },
  { n: 14, c: 'red'    }, { n: 31, c: 'black'  }, { n: 9,  c: 'red'    },
  { n: 22, c: 'black'  }, { n: 18, c: 'red'    }, { n: 29, c: 'black'  },
  { n: 7,  c: 'red'    }, { n: 28, c: 'black'  }, { n: 12, c: 'red'    },
  { n: 35, c: 'black'  }, { n: 3,  c: 'red'    }, { n: 26, c: 'black'  },
]

const REPEATS = 8
const TILE_W  = 78 + 6   // tile width + gap

const BETS = [
  { id: 'red',   label: 'Rojo',  multiplier: 2  },
  { id: 'black', label: 'Negro', multiplier: 2  },
  { id: 'green', label: 'Verde', multiplier: 14 },
  { id: 'even',  label: 'Par',   multiplier: 2  },
  { id: 'odd',   label: 'Impar', multiplier: 2  },
]

const CHIPS = [1000, 5000, 10000, 50000]

// ─── Easing ───────────────────────────────────────────────────────────────────
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Ruleta() {
  const navigate = useNavigate()
  const nombre   = localStorage.getItem('nombre') ?? 'Jugador'

  const { balance, updateBalance } = useBalance()

  const [betAmount, setBetAmount]     = useState(1000)
  const [selectedBet, setSelectedBet] = useState<string | null>(null)
  const [spinning, setSpinning]       = useState(false)
  const [resultNum, setResultNum]     = useState<number | null>(null)
  const [resultColor, setResultColor] = useState<string>('')
  const [outcome, setOutcome]         = useState<'win' | 'lose' | null>(null)
  const [delta, setDelta]             = useState<number>(0)

  const trackRef    = useRef<HTMLDivElement>(null)
  const currentX    = useRef(0)
  const initialized = useRef(false)
  // Snapshot balance at spin time to avoid stale closure inside rAF callback
  const balanceSnapshot = useRef(balance)

  // ── Track init ────────────────────────────────────────────────────────────────
  const initTrack = (el: HTMLDivElement) => {
    if (initialized.current) return
    initialized.current = true
    trackRef.current = el
    const wrapperWidth = el.parentElement!.offsetWidth
    const center = wrapperWidth / 2 - TILE_W / 2
    currentX.current = center
    el.style.transform = `translateX(${center}px)`
  }

  // ── Spin ──────────────────────────────────────────────────────────────────────
  const spin = () => {
    if (spinning || !selectedBet || betAmount > balance) return

    // Deduct bet upfront and snapshot the resulting balance
    const afterDebit = balance - betAmount
    updateBalance(afterDebit)
    balanceSnapshot.current = afterDebit

    setSpinning(true)
    setOutcome(null)
    setResultNum(null)
    setDelta(0)

    const landIndex = Math.floor(Math.random() * NUMBERS.length)
    const landed    = NUMBERS[landIndex]

    const wrapStart    = NUMBERS.length * 3
    const targetIdx    = wrapStart + landIndex
    const wrapperWidth = trackRef.current!.parentElement!.offsetWidth
    const center       = wrapperWidth / 2 - TILE_W / 2
    const targetX      = -(targetIdx * TILE_W - center)
    const extraSpins   = (3 + Math.floor(Math.random() * 2)) * NUMBERS.length * TILE_W
    const finalX       = targetX - extraSpins

    const duration  = 3400 + Math.random() * 600
    const startTime = performance.now()
    const startX    = currentX.current
    const distance  = finalX - startX

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const x = startX + distance * easeOut(t)
      trackRef.current!.style.transform = `translateX(${x}px)`

      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        currentX.current = finalX
        resolveResult(landed)
        setSpinning(false)
      }
    }
    requestAnimationFrame(animate)
  }

  // ── Resolve ───────────────────────────────────────────────────────────────────
  const resolveResult = (landed: typeof NUMBERS[0]) => {
    const { n, c } = landed
    setResultNum(n)
    setResultColor(c)

    let win = false
    if (selectedBet === 'red'   && c === 'red')             win = true
    if (selectedBet === 'black' && c === 'black')           win = true
    if (selectedBet === 'green' && c === 'green')           win = true
    if (selectedBet === 'even'  && n !== 0 && n % 2 === 0) win = true
    if (selectedBet === 'odd'   && n % 2 !== 0)            win = true

    const bet = BETS.find(b => b.id === selectedBet)!

    if (win) {
      // Full payout: return bet + winnings
      const payout = betAmount * bet.multiplier
      updateBalance(balanceSnapshot.current + payout)
      setDelta(payout - betAmount)   // net profit shown to user
    } else {
      // Already debited on spin — no further change
      setDelta(-betAmount)
    }

    setOutcome(win ? 'win' : 'lose')
  }

  // ── Tile utils ────────────────────────────────────────────────────────────────
  const allTiles = Array.from({ length: REPEATS }, () => NUMBERS).flat()

  const tileColor = (c: string) => {
    if (c === 'red')   return 'bg-red-700 border border-red-600'
    if (c === 'black') return 'bg-zinc-800 border border-zinc-700'
    return 'bg-green-800 border border-green-700'
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🃏</span>
          <div>
            <h1 className="text-foreground text-lg font-bold tracking-[4px] leading-none">CASHYNO</h1>
            <p className="text-muted-foreground text-[11px] mt-0.5">Ruleta</p>
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

      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-10">

        {/* Balance + delta */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Balance</p>
            <p className="text-foreground text-3xl font-bold">${balance.toLocaleString()}</p>
          </div>
          {outcome === 'win' && (
            <div className="text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Ganaste</p>
              <p className="text-green-500 text-3xl font-bold">+${delta.toLocaleString()}</p>
            </div>
          )}
          {outcome === 'lose' && (
            <div className="text-center">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">Perdiste</p>
              <p className="text-destructive text-3xl font-bold">-${betAmount.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Wheel track */}
        <div className="relative w-full max-w-2xl h-[90px] overflow-hidden">
          {/* Edge fades */}
          <div
            className="absolute inset-y-0 left-0 w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--background), transparent)' }}
          />
          <div
            className="absolute inset-y-0 right-0 w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--background), transparent)' }}
          />
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-primary z-20">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0
              border-l-[6px] border-r-[6px] border-t-[8px]
              border-l-transparent border-r-transparent border-t-primary"
            />
          </div>
          {/* Tiles */}
          <div
            ref={el => { if (el) initTrack(el) }}
            className="flex items-center h-full"
            style={{ gap: '6px', willChange: 'transform' }}
          >
            {allTiles.map((tile, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[78px] h-[78px] rounded-md flex items-center justify-center font-bold text-white ${tileColor(tile.c)}`}
                style={{ fontSize: tile.c === 'green' ? '14px' : '20px' }}
              >
                {tile.n}
              </div>
            ))}
          </div>
        </div>

        {/* Result number */}
        <div className="h-14 flex flex-col items-center justify-center gap-1">
          {resultNum !== null ? (
            <>
              <span className={`text-4xl font-black ${
                resultColor === 'red'   ? 'text-red-500' :
                resultColor === 'green' ? 'text-green-500' : 'text-foreground'
              }`}>{resultNum}</span>
              <span className="text-muted-foreground text-xs tracking-[4px] uppercase">{resultColor}</span>
            </>
          ) : (
            <span className="text-muted-foreground text-sm tracking-widest uppercase">elige tu apuesta</span>
          )}
        </div>

        {/* Bet type */}
        <div className="flex gap-2 flex-wrap justify-center">
          {BETS.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBet(b.id)}
              disabled={spinning}
              className={`px-4 py-2 rounded-lg text-sm border transition-all cursor-pointer disabled:opacity-40 ${
                selectedBet === b.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground'
              }`}
            >
              {b.label}
              <span className="ml-1.5 text-xs opacity-60">x{b.multiplier}</span>
            </button>
          ))}
        </div>

        {/* Chips */}
        <div className="flex gap-2 flex-wrap justify-center">
          {CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => setBetAmount(chip)}
              disabled={spinning}
              className={`w-16 h-16 rounded-full text-sm font-bold border-2 transition-all cursor-pointer disabled:opacity-40 ${
                betAmount === chip
                  ? 'bg-primary text-primary-foreground border-primary scale-110'
                  : 'bg-card text-foreground border-border hover:border-primary'
              }`}
            >
              ${chip >= 1000 ? `${chip / 1000}K` : chip}
            </button>
          ))}
        </div>

        {/* Spin button */}
        <button
          onClick={spin}
          disabled={spinning || !selectedBet || betAmount > balance}
          className="px-16 py-4 bg-primary text-primary-foreground font-bold tracking-[4px] uppercase rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {spinning ? 'Girando...' : `Apostar $${betAmount.toLocaleString()}`}
        </button>

        {balance <= 0 && !spinning && (
          <p className="text-destructive text-sm tracking-widest">Sin fondos — recarga tu cuenta</p>
        )}

      </main>
    </div>
  )
}