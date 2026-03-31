// src/hooks/useApiKeys.js
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'frescamart_api_keys'

export function useApiKeys() {
  const [keys, setKeys] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? { gemini: '', groq: '' }
    } catch {
      return { gemini: '', groq: '' }
    }
  })

  const save = (patch) => {
    setKeys(prev => {
      const next = { ...prev, ...patch }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return { keys, save }
}
