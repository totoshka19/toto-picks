'use client'

import { useTranslations } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { PersonSearchInput } from './person-search-input'

export const FilterDirector = () => {
  const t = useTranslations('filters')
  const store = useFiltersStore()

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{t('director')}</label>
      <PersonSearchInput
        value={store.director}
        onChange={store.setDirector}
        placeholder={t('directorPlaceholder')}
      />
    </div>
  )
}
