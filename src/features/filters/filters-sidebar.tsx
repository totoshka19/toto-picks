'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useFiltersStore } from '@/store/filters'
import { FilterSort } from './filter-sort'
import { FilterGenres } from './filter-genres'
import { FilterCountries } from './filter-countries'
import { FilterYearRange } from './filter-year-range'
import { FilterRatingRange } from './filter-rating-range'
import { FilterVoteCount } from './filter-vote-count'
import { FilterActors } from './filter-actors'
import { FilterDirector } from './filter-director'
import { cn } from '@/lib/utils'
import type { Genre, TMDBCountry } from '@/types/tmdb'
import type { SortOption } from '@/types/app'

interface FiltersSidebarProps {
  genres: Genre[]
  countries: TMDBCountry[]
  onApply?: () => void
  className?: string
  sortOptions?: readonly SortOption[]
}

export const FiltersSidebar = ({ genres, countries, onApply, className, sortOptions }: FiltersSidebarProps) => {
  const t = useTranslations('filters')
  const store = useFiltersStore()

  return (
    <div className={cn('space-y-5', className)}>
      {sortOptions && (
        <>
          <FilterSort sortOptions={sortOptions} onApply={onApply} />
          <Separator />
        </>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          {t('title')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { store.resetFilters(); onApply?.() }}
          className="text-xs h-7 text-muted-foreground hover:text-foreground"
        >
          {t('reset')}
        </Button>
      </div>

      <Separator />

      <FilterGenres genres={genres} />

      <Separator />

      <FilterCountries countries={countries} />

      <Separator />

      <FilterYearRange />

      <Separator />

      <FilterRatingRange />

      <Separator />

      <FilterVoteCount />

      <Separator />

      <FilterActors />

      <Separator />

      <FilterDirector />

      <Separator className="lg:hidden" />

      <Button onClick={onApply} className="w-full lg:hidden">
        {t('apply')}
      </Button>
    </div>
  )
}
