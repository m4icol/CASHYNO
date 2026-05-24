import { useCallback } from 'react'
import api from '../api/axios'

export interface HistorialEntry {
  id:        number
  juego:     string
  apostado:  number
  resultado: number
  fecha:     string
}

export function useHistorial() {
  const registrar = useCallback(async (
    juego:     string,
    apostado:  number,
    resultado: number   // positivo = ganó, negativo = perdió
  ) => {
    try {
      await api.post('/jugadores/me/historial', { juego, apostado, resultado })
    } catch {
      console.error('Error al registrar historial')
    }
  }, [])

  return { registrar }
}