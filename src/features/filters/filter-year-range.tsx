'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Slider } from '@/components/ui/slider'
import { useFiltersStore } from '@/store/filters'
import { MIN_YEAR, CURRENT_YEAR } from '@/lib/constants'

export const FilterYearRange = () => {
  const t = useTranslations('filters')
  const store = useFiltersStore()

  // Draft state for year inputs — allows free typing without clamping mid-edit
  const [yearFromDraft, setYearFromDraft] = useState(String(store.yearFrom))
  const [yearToDraft, setYearToDraft] = useState(String(store.yearTo))

  // Keep drafts in sync when slider moves
  useEffect(() => { setYearFromDraft(String(store.yearFrom)) }, [store.yearFrom])
  useEffect(() => { setYearToDraft(String(store.yearTo)) }, [store.yearTo])

  const commitYearFrom = () => {
    const parsed = parseInt(yearFromDraft)
    if (!parsed) { setYearFromDraft(String(store.yearFrom)); return }
    const val = Math.min(parsed, store.yearTo)
    store.setYearFrom(val)
    setYearFromDraft(String(val))
  }

  const commitYearTo = () => {
    const parsed = parseInt(yearToDraft)
    if (!parsed) { setYearToDraft(String(store.yearTo)); return }
    const val = Math.max(parsed, store.yearFrom)
    store.setYearTo(val)
    setYearToDraft(String(val))
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{t('year')}</label>
      <div className="flex items-center gap-2 mt-1">
        <input
          type="number"
          value={yearFromDraft}
          onChange={(e) => setYearFromDraft(e.target.value)}
          onBlur={commitYearFrom}
          onKeyDown={(e) => e.key === 'Enter' && commitYearFrom()}
          className="w-16 h-7 px-2 text-xs rounded-md border border-border bg-background text-center focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-muted-foreground">—</span>
        <input
          type="number"
          value={yearToDraft}
          onChange={(e) => setYearToDraft(e.target.value)}
          onBlur={commitYearTo}
          onKeyDown={(e) => e.key === 'Enter' && commitYearTo()}
          className="w-16 h-7 px-2 text-xs rounded-md border border-border bg-background text-center focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <Slider
        min={Math.min(store.yearFrom, MIN_YEAR)}
        max={Math.max(store.yearTo, CURRENT_YEAR)}
        step={1}
        value={[store.yearFrom, store.yearTo]}
        onValueChange={([from, to]) => {
          store.setYearFrom(from)
          store.setYearTo(to)
        }}
        className="mt-1"
      />
    </div>
  )
}
