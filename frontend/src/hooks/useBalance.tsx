import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const EVENT   = 'balancechange'
const DEFAULT = 100_000

export function useBalance() {
  const [balance, setBalance]   = useState<number>(DEFAULT)
  const [loading, setLoading]   = useState<boolean>(true)

  // Load from backend on mount
  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'jugador') { setLoading(false); return }

    api.get('/jugadores/me/saldo')
      .then(res => setBalance(res.data.saldo))
      .catch(() => {
        // fallback to localStorage if backend fails
        const raw    = localStorage.getItem('cashyno_balance')
        const parsed = raw ? parseInt(raw, 10) : NaN
        setBalance(isNaN(parsed) ? DEFAULT : parsed)
      })
      .finally(() => setLoading(false))
  }, [])

  // Sync between tabs / components (same session)
  useEffect(() => {
    const sync = () => {
      api.get('/jugadores/me/saldo')
        .then(res => setBalance(res.data.saldo))
        .catch(() => {})
    }
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])

  const updateBalance = useCallback(async (newBalance: number) => {
    setBalance(newBalance) // optimistic update
    try {
      const res = await api.put('/jugadores/me/saldo', { saldo: newBalance })
      setBalance(res.data.saldo)
      window.dispatchEvent(new Event(EVENT))
    } catch {
      console.error('Error al guardar saldo en el servidor')
    }
  }, [])

  return { balance, loading, updateBalance }
}