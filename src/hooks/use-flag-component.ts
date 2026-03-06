'use client'

import { useState, useEffect } from 'react'
import type { ComponentType, SVGProps } from 'react'

type FlagModule = Record<string, ComponentType<SVGProps<SVGSVGElement>>>

// Module-level cache — shared across all component instances
let flagModuleCache: FlagModule | null = null

export const useFlagComponent = (code: string | undefined) => {
  const [Flag, setFlag] = useState<ComponentType<SVGProps<SVGSVGElement>> | null>(null)

  useEffect(() => {
    if (!code) { setFlag(null); return }
    const upper = code.toUpperCase()
    if (flagModuleCache) {
      setFlag(() => flagModuleCache![upper] ?? null)
      return
    }
    import('country-flag-icons/react/3x2')
      .then((mod) => {
        flagModuleCache = mod as unknown as FlagModule
        setFlag(() => flagModuleCache![upper] ?? null)
      })
      .catch(() => setFlag(null))
  }, [code])

  return Flag
}
