import { useNavigate } from 'react-router-dom'
import { menuItems, stats } from '@/types/menuItems'

export default function Menu() {
  const navigate = useNavigate()
  const role   = localStorage.getItem('role')   ?? 'jugador'
  const nombre = localStorage.getItem('nombre') ?? 'Usuario'
  const items  = menuItems[role] ?? menuItems.jugador

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <span className="text-3xl text-foreground">🃏</span>
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-[4px] leading-none">CASHYNO</h1>
            <p className="text-muted-foreground text-[11px] mt-0.5">Sistema de Gestión</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-foreground text-sm font-semibold leading-none">{nombre}</p>
            <p className="text-muted-foreground text-[11px] tracking-widest mt-0.5">{role.toUpperCase()}</p>
          </div>
          <button
            onClick={handleLogout}
            className="border border-destructive/40 text-destructive text-sm px-4 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-8 py-10">
        <h2 className="text-foreground text-2xl font-light mb-1">
          Bienvenido, <span className="text-primary font-semibold">{nombre.split(' ')[0]}</span>
        </h2>
        <p className="text-muted-foreground text-sm mb-8">¿Qué deseas gestionar hoy?</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.label}
              className={`bg-card border border-border border-l-4 ${item.accent} rounded-2xl p-6 cursor-pointer hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-foreground text-base font-semibold mb-1">{item.label}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Stats bar */}
      <footer className="flex justify-around px-8 py-4 bg-card border-t border-border">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <span className="text-foreground text-xl font-bold block">{s.value}</span>
            <span className="text-muted-foreground text-xs">{s.label}</span>
          </div>
        ))}
      </footer>

    </div>
  )
}