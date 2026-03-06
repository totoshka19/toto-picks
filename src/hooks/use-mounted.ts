'use client'

import { useState, useEffect } from 'react'

/** Returns `true` after the component has mounted on the client.
 *  Used to avoid SSR/hydration mismatches with client-only stores (e.g. Zustand + localStorage). */
export const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
