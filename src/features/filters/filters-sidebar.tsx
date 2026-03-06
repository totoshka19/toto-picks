'use client'

import { useTranslations } from 'next-intl'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useFiltersStore } from '@/store/filters'
import { PersonSearchInput } from './person-search-input'
import { VOTE_COUNT_OPTIONS, POPULAR_COUNTRIES, MIN_YEAR, CURRENT_YEAR } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Genre } from '@/types/tmdb'
import { useLocale } from 'next-intl'

interface SortOption {
  value: string
  labelKey: string
}

interface FiltersSidebarProps {
  genres: Genre[]
  onApply?: () => void
  className?: string
  sortOptions?: readonly SortOption[]
}

export const FiltersSidebar = ({ genres, onApply, className, sortOptions }: FiltersSidebarProps) => {
  const t = useTranslations('filters')
  const tSort = useTranslations('sort')
  const locale = useLocale()
  const store = useFiltersStore()

  const handleApply = () => {
    onApply?.()
  }

  return (
    <div className={cn('space-y-5', className)}>
      {sortOptions && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('sort')}</label>
            <Select
              value={store.sortBy}
              onValueChange={(v) => { store.setSortBy(v); onApply?.() }}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {tSort(opt.labelKey as Parameters<typeof tSort>[0])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

      {/* Genres */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('genres')}</label>
        <div className="flex flex-wrap gap-1.5">
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

      <Separator />

      {/* Country */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('country')}</label>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => store.toggleCountry(country.code)}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                store.countries.includes(country.code)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              )}
            >
              {locale === 'ru' ? country.nameRu : country.nameEn}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Year range */}
      <div className="space-y-3">
        <label className="text-sm font-medium">{t('year')}</label>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{store.yearFrom}</span>
          <span>—</span>
          <span>{store.yearTo}</span>
        </div>
        <Slider
          min={MIN_YEAR}
          max={CURRENT_YEAR}
          step={1}
          value={[store.yearFrom, store.yearTo]}
          onValueChange={([from, to]) => {
            store.setYearFrom(from)
            store.setYearTo(to)
          }}
          className="mt-1"
        />
      </div>

      <Separator />

      {/* Rating range */}
      <div className="space-y-3">
        <label className="text-sm font-medium">{t('rating')}</label>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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

      <Separator />

      {/* Vote count */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('votes')}</label>
        <Select
          value={String(store.voteCountMin)}
          onValueChange={(v) => store.setVoteCountMin(Number(v))}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOTE_COUNT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {'labelKey' in opt ? t(opt.labelKey as Parameters<typeof t>[0]) : opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Actor search */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('actor')}</label>
        {store.actors.map((actor) => (
          <div key={actor.id} className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm">
            <span className="flex-1 truncate">{actor.name}</span>
            <button onClick={() => store.removeActor(actor.id)} className="text-muted-foreground hover:text-foreground">
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

      <Separator />

      {/* Director search */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('director')}</label>
        <PersonSearchInput
          value={store.director}
          onChange={store.setDirector}
          placeholder={t('directorPlaceholder')}
        />
      </div>

      <Separator />

      <Button onClick={handleApply} className="w-full">
        {t('apply')}
      </Button>
    </div>
  )
}
