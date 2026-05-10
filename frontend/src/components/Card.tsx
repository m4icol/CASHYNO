import { esRoja, type Carta } from "@/pages/Blackjack";

export function CartaUI({ carta, animado = false }: { carta: Carta; animado?: boolean }) {
  if (carta.oculta) {
    return (
      <div
        className={`relative w-[70px] h-[100px] rounded-xl border border-border shadow-lg flex items-center justify-center ${animado ? 'carta-entrada' : ''}`}
        style={{
          background: 'repeating-linear-gradient(45deg, #1a1a2e 0px, #1a1a2e 4px, #16213e 4px, #16213e 8px)',
        }}
      >
        <span style={{ fontSize: 28, opacity: 0.4 }}>🂠</span>
      </div>
    )
  }
  const roja = esRoja(carta.palo)
  return (
    <div
      className={`relative w-[70px] h-[100px] rounded-xl shadow-lg flex flex-col justify-between p-1.5 select-none ${animado ? 'carta-entrada' : ''}`}
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div style={{ color: roja ? '#ef4444' : 'var(--foreground)', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>
        <div>{carta.valor}</div>
        <div>{carta.palo}</div>
      </div>
      <div style={{ color: roja ? '#ef4444' : 'var(--foreground)', fontSize: 22, textAlign: 'center', lineHeight: 1 }}>
        {carta.palo}
      </div>
      <div style={{ color: roja ? '#ef4444' : 'var(--foreground)', fontSize: 13, fontWeight: 700, lineHeight: 1, transform: 'rotate(180deg)' }}>
        <div>{carta.valor}</div>
        <div>{carta.palo}</div>
      </div>
    </div>
  )
}