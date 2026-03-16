'use client'

import { useTranslations } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { cn } from '@/lib/utils'
import type { Genre } from '@/types/tmdb'

interface FilterGenresProps {
  genres: Genre[]
}

export const FilterGenres = ({ genres }: FilterGenresProps) => {
  const t = useTranslations('filters')
  const store = useFiltersStore()

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t('genres')}</label>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => store.toggleGenre(genre.id)}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
              store.genres.includes(genre.id)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            )}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  )
}
