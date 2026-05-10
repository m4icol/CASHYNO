import { useState, useEffect, useCallback } from 'react'

const KEY     = 'cashyno_balance'
const DEFAULT = 100_000
const EVENT   = 'balancechange'

function readBalance(): number {
  const raw    = localStorage.getItem(KEY)
  const parsed = raw ? parseInt(raw, 10) : NaN
  return isNaN(parsed) ? DEFAULT : parsed
}

export function useBalance() {
  const [balance, setBalance] = useState<number>(readBalance)

  // Sync when another game updates the balance (same tab via custom event, other tabs via storage)
  useEffect(() => {
    const sync = () => setBalance(readBalance())
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const updateBalance = useCallback((newBalance: number) => {
    localStorage.setItem(KEY, String(newBalance))
    setBalance(newBalance)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  return { balance, updateBalance }
}