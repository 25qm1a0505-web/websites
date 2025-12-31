'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { loadFromStorage } = useStore()

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return <>{children}</>
}

