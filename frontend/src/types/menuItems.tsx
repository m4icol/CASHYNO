import type { MenuItem } from "."

export const menuItems: Record<string, MenuItem[]> = {
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
    { icon: '🎲', label: 'Ruleta',       desc: 'Jugar ruleta en línea',           accent: 'border-l-red-500'     },
    { icon: '🃏', label: 'BlackJack', desc: 'Jugar ruleta en línea',           accent: 'border-l-blue-500'     },
    { icon: '🏆', label: 'Mis premios',  desc: 'Premios y pagos pendientes',      accent: 'border-l-orange-500'  },
    ],
}

export const stats = [
  { label: 'Mesas activas', value: '4'     },
  { label: 'Jugadores hoy', value: '12'    },
  { label: 'Apuestas hoy',  value: '48'    },
  { label: 'En caja',       value: '$2.4M' },
]