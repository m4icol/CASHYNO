import type { MenuItem } from "."

export const menuItems: Record<string, MenuItem[]> = {
  administrador: [
    { icon: '👥', label: 'Jugadores',    desc: 'Gestionar jugadores registrados', accent: 'border-l-teal-500'    },
    { icon: '🎮', label: 'Juegos',       desc: 'Catálogo de juegos disponibles',  accent: 'border-l-green-500'   },
  ],

    jugador: [
    { icon: '🎰', label: 'Historial',        desc: 'Ver historial de juegos',           accent: 'border-l-yellow-500'  },
    { icon: '🎲', label: 'Ruleta',       desc: 'Jugar ruleta en línea',           accent: 'border-l-red-500'     },
    { icon: '🃏', label: 'BlackJack', desc: 'Jugar blackjack en línea',           accent: 'border-l-blue-500'     },
    ],
}

export const stats = [
  { label: 'Mesas activas', value: '4'     },
  { label: 'Jugadores hoy', value: '12'    },
  { label: 'Apuestas hoy',  value: '48'    },
  { label: 'En caja',       value: '$2.4M' },
]