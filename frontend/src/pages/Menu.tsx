import { useNavigate } from 'react-router-dom'
import type { MenuItem } from '../types'

const menuItems: Record<string, MenuItem[]> = {
  administrador: [
    { icon: '👥', label: 'Jugadores',    desc: 'Gestionar jugadores registrados', color: 'from-teal-400/20 to-teal-400/5 border-teal-400/30'     },
    { icon: '👔', label: 'Empleados',    desc: 'Gestionar personal del casino',   color: 'from-sky-400/20 to-sky-400/5 border-sky-400/30'         },
    { icon: '🎮', label: 'Juegos',       desc: 'Catálogo de juegos disponibles',  color: 'from-green-400/20 to-green-400/5 border-green-400/30'   },
    { icon: '🎰', label: 'Mesas',        desc: 'Estado de mesas en piso',         color: 'from-yellow-400/20 to-yellow-400/5 border-yellow-400/30' },
    { icon: '🃏', label: 'Sesiones',     desc: 'Sesiones activas e historial',    color: 'from-purple-400/20 to-purple-400/5 border-purple-400/30' },
    { icon: '💰', label: 'Caja',         desc: 'Movimientos y auditoría',         color: 'from-emerald-400/20 to-emerald-400/5 border-emerald-400/30' },
  ],
  supervisor: [
    { icon: '👥', label: 'Jugadores',    desc: 'Ver y gestionar jugadores',       color: 'from-teal-400/20 to-teal-400/5 border-teal-400/30'     },
    { icon: '🎰', label: 'Mesas',        desc: 'Estado de mesas en piso',         color: 'from-yellow-400/20 to-yellow-400/5 border-yellow-400/30' },
    { icon: '🃏', label: 'Sesiones',     desc: 'Sesiones activas e historial',    color: 'from-purple-400/20 to-purple-400/5 border-purple-400/30' },
    { icon: '🏆', label: 'Premios',      desc: 'Autorizar premios ganados',       color: 'from-orange-400/20 to-orange-400/5 border-orange-400/30' },
  ],
  crupier: [
    { icon: '🎰', label: 'Mesas',        desc: 'Ver mesas asignadas',             color: 'from-yellow-400/20 to-yellow-400/5 border-yellow-400/30' },
    { icon: '🃏', label: 'Sesiones',     desc: 'Gestionar sesión activa',         color: 'from-purple-400/20 to-purple-400/5 border-purple-400/30' },
    { icon: '🎲', label: 'Apuestas',     desc: 'Registrar apuestas y resultados', color: 'from-red-400/20 to-red-400/5 border-red-400/30'         },
  ],
  cajero: [
    { icon: '💰', label: 'Caja',         desc: 'Registrar movimientos',           color: 'from-emerald-400/20 to-emerald-400/5 border-emerald-400/30' },
    { icon: '💳', label: 'Pagos',        desc: 'Procesar pagos de premios',       color: 'from-cyan-400/20 to-cyan-400/5 border-cyan-400/30'      },
  ],
  jugador: [
    { icon: '🎮', label: 'Juegos',       desc: 'Ver juegos disponibles',          color: 'from-green-400/20 to-green-400/5 border-green-400/30'   },
    { icon: '🎰', label: 'Mesas',        desc: 'Ver mesas disponibles',           color: 'from-yellow-400/20 to-yellow-400/5 border-yellow-400/30' },
    { icon: '🎲', label: 'Mis apuestas', desc: 'Historial de apuestas',           color: 'from-red-400/20 to-red-400/5 border-red-400/30'         },
    { icon: '🏆', label: 'Mis premios',  desc: 'Premios y pagos pendientes',      color: 'from-orange-400/20 to-orange-400/5 border-orange-400/30' },
  ],
}

const stats = [
  { label: 'Mesas activas',  value: '4'     },
  { label: 'Jugadores hoy',  value: '12'    },
  { label: 'Apuestas hoy',   value: '48'    },
  { label: 'En caja',        value: '$2.4M' },
]

export default function Menu() {
  const navigate = useNavigate()
  const role     = localStorage.getItem('role')   ?? 'jugador'
  const nombre   = localStorage.getItem('nombre') ?? 'Usuario'
  const items    = menuItems[role] ?? menuItems.jugador

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a2e] to-[#16213e] flex flex-col font-sans">

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-yellow-400/15 bg-black/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl text-yellow-400">♠</span>
          <div>
            <h1 className="text-yellow-400 text-xl font-bold tracking-[4px] leading-none">CASHYNO</h1>
            <p className="text-white/30 text-[11px] mt-0.5">Sistema de Gestión</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white text-sm font-semibold leading-none">{nombre}</p>
            <p className="text-yellow-400 text-[11px] tracking-widest mt-0.5">{role.toUpperCase()}</p>
          </div>
          <button
            onClick={handleLogout}
            className="border border-red-400/40 text-red-400/80 text-sm px-4 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-8 py-10">
        <h2 className="text-white text-2xl font-light mb-1">
          Bienvenido, <span className="text-yellow-400 font-semibold">{nombre.split(' ')[0]}</span>
        </h2>
        <p className="text-white/40 text-sm mb-8">¿Qué deseas gestionar hoy?</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item: MenuItem) => (
            <div
              key={item.label}
              className={`relative bg-gradient-to-br ${item.color} border rounded-2xl p-6 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl transition-all duration-200 overflow-hidden group`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-white text-base font-semibold mb-1">{item.label}</h3>
              <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Stats bar */}
      <footer className="flex justify-around px-8 py-4 bg-black/40 border-t border-yellow-400/15">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <span className="text-yellow-400 text-xl font-bold block">{s.value}</span>
            <span className="text-white/35 text-xs">{s.label}</span>
          </div>
        ))}
      </footer>

    </div>
  )
}