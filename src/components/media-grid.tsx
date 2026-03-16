import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MediaGridProps {
  children: ReactNode
  className?: string
}

/**
 * Responsive grid wrapper for media cards.
 * Default columns: 2 → 4 (sm) → 5 (md) — the search page layout.
 * Pass `className` to override columns for other layouts:
 *   catalog:    sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
 *   favorites:  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
 */
export const MediaGrid = ({ children, className }: MediaGridProps) => (
  <div className={cn('grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3', className)}>
    {children}
  </div>
)
