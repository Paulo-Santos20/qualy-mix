// src/hooks/useCountdown.js
import { useState, useEffect } from 'react'

/**
 * Retorna { hours, minutes, seconds, isExpired } dado um timestamp Unix (ms).
 */
export function useCountdown(endsAt) {
  const calc = () => {
    const diff = Math.max(0, endsAt - Date.now())
    return {
      hours:     Math.floor(diff / 3_600_000),
      minutes:   Math.floor((diff % 3_600_000) / 60_000),
      seconds:   Math.floor((diff % 60_000) / 1_000),
      isExpired: diff === 0,
    }
  }

  const [time, setTime] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1_000)
    return () => clearInterval(id)
  }, [endsAt])

  return time
}
