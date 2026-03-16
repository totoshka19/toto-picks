'use client'

import { useTranslations } from 'next-intl'
import { Slider } from '@/components/ui/slider'
import { useFiltersStore } from '@/store/filters'

export const FilterRatingRange = () => {
  const t = useTranslations('filters')
  const store = useFiltersStore()

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{t('rating')}</label>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <span>{store.ratingFrom.toFixed(1)}</span>
        <span>—</span>
        <span>{store.ratingTo.toFixed(1)}</span>
      </div>
      <Slider
        min={0}
        max={10}
        step={0.1}
        value={[store.ratingFrom, store.ratingTo]}
        onValueChange={([from, to]) => {
          store.setRatingFrom(from)
          store.setRatingTo(to)
        }}
      />
    </div>
  )
}
