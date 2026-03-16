'use client'

import { useTranslations } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { PersonSearchInput } from './person-search-input'

export const FilterActors = () => {
  const t = useTranslations('filters')
  const store = useFiltersStore()

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{t('actor')}</label>
      {store.actors.map((actor) => (
        <div
          key={actor.id}
          className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm"
        >
          <span className="flex-1 truncate">{actor.name}</span>
          <button
            onClick={() => store.removeActor(actor.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>
      ))}
      {store.actors.length < 3 && (
        <PersonSearchInput
          value={null}
          onChange={(p) => p && store.addActor(p)}
          placeholder={t('actorPlaceholder')}
        />
      )}
    </div>
  )
}
