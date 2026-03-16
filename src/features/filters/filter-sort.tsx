'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { cn } from '@/lib/utils'
import { TrendingUp, Star, Calendar, Users, ArrowDown, ArrowUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SortOption } from '@/types/app'

const SORT_ICON_MAP: Record<string, LucideIcon> = {
  popularity: TrendingUp,
  vote_average: Star,
  primary_release_date: Calendar,
  first_air_date: Calendar,
  vote_count: Users,
}

const SORT_LABEL_KEY_MAP: Record<string, string> = {
  popularity: 'popularity',
  vote_average: 'rating',
  primary_release_date: 'date',
  first_air_date: 'date',
  vote_count: 'votes',
}

interface FilterSortProps {
  sortOptions: readonly SortOption[]
  onApply?: () => void
}

export const FilterSort = ({ sortOptions, onApply }: FilterSortProps) => {
  const t = useTranslations('filters')
  const tSort = useTranslations('sort')
  const store = useFiltersStore()

  const sortGroups = useMemo(() => {
    const seen = new Set<string>()
    const result: string[] = []
    for (const opt of sortOptions) {
      const base = opt.value.replace(/\.(desc|asc)$/, '')
      if (!seen.has(base)) { seen.add(base); result.push(base) }
    }
    return result
  }, [sortOptions])

  const activeBase = store.sortBy.replace(/\.(desc|asc)$/, '')
  const activeDirIsDesc = store.sortBy.endsWith('.desc')

  const handleClick = (base: string) => {
    if (activeBase === base) {
      const hasAsc = sortOptions.some((opt) => opt.value === `${base}.asc`)
      if (hasAsc) {
        store.setSortBy(activeDirIsDesc ? `${base}.asc` : `${base}.desc`)
      }
    } else {
      store.setSortBy(`${base}.desc`)
    }
    onApply?.()
  }

  if (sortGroups.length === 0) return null

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t('sort')}</label>
      <div className="grid grid-cols-2 gap-1.5 mt-1">
        {sortGroups.map((base) => {
          const Icon = SORT_ICON_MAP[base] ?? TrendingUp
          const labelKey = SORT_LABEL_KEY_MAP[base] ?? 'popularity'
          const isActive = activeBase === base
          return (
            <button
              key={base}
              onClick={() => handleClick(base)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 text-left">{tSort(labelKey as Parameters<typeof tSort>[0])}</span>
              {isActive && (
                activeDirIsDesc
                  ? <ArrowDown className="h-3 w-3 shrink-0" />
                  : <ArrowUp className="h-3 w-3 shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
