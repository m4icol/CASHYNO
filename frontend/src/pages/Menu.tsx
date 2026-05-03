import { useNavigate } from 'react-router-dom'
import type { MenuItem } from '../types'

const menuItems: Record<string, MenuItem[]> = {
  administrador: [
    { icon: '👥', label: 'Jugadores',    desc: 'Gestionar jugadores registrados', accent: 'border-l-teal-500'    },
    { icon: '👔', label: 'Empleados',    desc: 'Gestionar personal del casino',   accent: 'border-l-sky-500'     },
    { icon: '🎮', label: 'Juegos',       desc: 'Catálogo de juegos disponibles',  accent: 'border-l-green-500'   },
    { icon: '🎰', label: 'Mesas',        desc: 'Estado de mesas en piso',         accent: 'border-l-yellow-500'  },
    { icon: '🃏', label: 'Sesiones',     desc: 'Sesiones activas e historial',    accent: 'border-l-purple-500'  },
    { icon: '💰', label: 'Caja',         desc: 'Movimientos y auditoría',         accent: 'border-l-emerald-500' },
  ],
  supervisor: [
    { icon: '👥', label: 'Jugadores',    desc: 'Ver y gestionar jugadores',       accent: 'border-l-teal-500'    },
    { icon: '🎰', label: 'Mesas',        desc: 'Estado de mesas en piso',         accent: 'border-l-yellow-500'  },
    { icon: '🃏', label: 'Sesiones',     desc: 'Sesiones activas e historial',    accent: 'border-l-purple-500'  },
    { icon: '🏆', label: 'Premios',      desc: 'Autorizar premios ganados',       accent: 'border-l-orange-500'  },
  ],
  crupier: [
    { icon: '🎰', label: 'Mesas',        desc: 'Ver mesas asignadas',             accent: 'border-l-yellow-500'  },
    { icon: '🃏', label: 'Sesiones',     desc: 'Gestionar sesión activa',         accent: 'border-l-purple-500'  },
    { icon: '🎲', label: 'Apuestas',     desc: 'Registrar apuestas y resultados', accent: 'border-l-red-500'     },
  ],
  cajero: [
    { icon: '💰', label: 'Caja',         desc: 'Registrar movimientos',           accent: 'border-l-emerald-500' },
    { icon: '💳', label: 'Pagos',        desc: 'Procesar pagos de premios',       accent: 'border-l-cyan-500'    },
  ],
  jugador: [
    { icon: '🎮', label: 'Juegos',       desc: 'Ver juegos disponibles',          accent: 'border-l-green-500'   },
    { icon: '🎰', label: 'Mesas',        desc: 'Ver mesas disponibles',           accent: 'border-l-yellow-500'  },
    { icon: '🎲', label: 'Mis apuestas', desc: 'Historial de apuestas',           accent: 'border-l-red-500'     },
    { icon: '🏆', label: 'Mis premios',  desc: 'Premios y pagos pendientes',      accent: 'border-l-orange-500'  },
  ],
}

const stats = [
  { label: 'Mesas activas', value: '4'     },
  { label: 'Jugadores hoy', value: '12'    },
  { label: 'Apuestas hoy',  value: '48'    },
  { label: 'En caja',       value: '$2.4M' },
]

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