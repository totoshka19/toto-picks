'use client'

import { useTranslations } from 'next-intl'
import { Slider } from '@/components/ui/slider'
import { useFiltersStore } from '@/store/filters'
import { VOTE_COUNT_MAX } from '@/lib/constants'

export const FilterVoteCount = () => {
  const t = useTranslations('filters')
  const store = useFiltersStore()

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{t('votes')}</label>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <span>{store.voteCountMin === 0 ? '0' : `${store.voteCountMin / 1000}K`}</span>
        <span>—</span>
        <span>
          {store.voteCountMax >= VOTE_COUNT_MAX
            ? `${VOTE_COUNT_MAX / 1000}K+`
            : `${store.voteCountMax / 1000}K`}
        </span>
      </div>
      <Slider
        min={0}
        max={VOTE_COUNT_MAX}
        step={1000}
        value={[store.voteCountMin, store.voteCountMax]}
        onValueChange={([min, max]) => {
          store.setVoteCountMin(min)
          store.setVoteCountMax(max)
        }}
        className="mt-1"
      />
    </div>
  )
}
