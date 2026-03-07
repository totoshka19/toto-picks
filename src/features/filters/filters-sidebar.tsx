'use client'

import { useMemo, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useFiltersStore } from '@/store/filters'
import { PersonSearchInput } from './person-search-input'
import { MIN_YEAR, CURRENT_YEAR, FILM_COUNTRIES, FILM_COUNTRIES_ORDERED } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Genre, TMDBCountry } from '@/types/tmdb'
import type { SortOption } from '@/types/app'
import { useLocale } from 'next-intl'
import { TrendingUp, Star, Calendar, Users, ArrowDown, ArrowUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface FiltersSidebarProps {
  genres: Genre[]
  countries: TMDBCountry[]
  onApply?: () => void
  className?: string
  sortOptions?: readonly SortOption[]
}

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

const VOTE_COUNT_MAX = 50000

export const FiltersSidebar = ({ genres, countries, onApply, className, sortOptions }: FiltersSidebarProps) => {
  const t = useTranslations('filters')
  const tSort = useTranslations('sort')
  const locale = useLocale()
  const store = useFiltersStore()
  const [countrySearch, setCountrySearch] = useState('')
  // Locale-aware country name resolver — initialised client-side only via useEffect
  // to avoid SSR/client Intl ICU divergence (Node and browsers ship different ICU
  // datasets, e.g. Node: "Гонконг", browser: "Гонконг (САР)").
  // null on the server and during hydration → both renders use english_name fallback.
  const [countryNames, setCountryNames] = useState<Intl.DisplayNames | null>(null)
  useEffect(() => {
    try {
      setCountryNames(new Intl.DisplayNames([locale], { type: 'region' }))
    } catch {
      setCountryNames(null)
    }
  }, [locale])

  // If Intl has no translation it returns the code itself — detect and use fallback
  const getCountryName = (isoCode: string, fallback: string) => {
    const name = countryNames?.of(isoCode)
    return name && name !== isoCode ? name : fallback
  }

  const sortGroups = useMemo(() => {
    if (!sortOptions) return []
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

  const handleSortClick = (base: string) => {
    if (activeBase === base) {
      const hasAsc = sortOptions?.some(opt => opt.value === `${base}.asc`)
      if (hasAsc) {
        store.setSortBy(activeDirIsDesc ? `${base}.asc` : `${base}.desc`)
      }
    } else {
      store.setSortBy(`${base}.desc`)
    }
    onApply?.()
  }

  const handleApply = () => {
    onApply?.()
  }

  // Priority index map for O(1) sort lookup
  const priorityMap = useMemo(
    () => new Map(FILM_COUNTRIES_ORDERED.map((code, i) => [code, i])),
    []
  )

  // Without search: sorted by cinematic prominence; with search: alphabetical among matches
  const filteredCountries = useMemo(() => {
    const unselected = countries.filter(c =>
      FILM_COUNTRIES.has(c.iso_3166_1) && !store.countries.includes(c.iso_3166_1)
    )
    if (!countrySearch.trim()) {
      return [...unselected].sort(
        (a, b) => (priorityMap.get(a.iso_3166_1) ?? 999) - (priorityMap.get(b.iso_3166_1) ?? 999)
      )
    }
    const q = countrySearch.toLowerCase()
    return unselected
      .filter(c => getCountryName(c.iso_3166_1, c.english_name).toLowerCase().includes(q))
      .sort((a, b) =>
        getCountryName(a.iso_3166_1, a.english_name).localeCompare(
          getCountryName(b.iso_3166_1, b.english_name), locale
        )
      )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, store.countries, countrySearch, countryNames, locale, priorityMap])

  return (
    <div className={cn('space-y-5', className)}>
      {sortOptions && sortGroups.length > 0 && (
        <>
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
                    onClick={() => handleSortClick(base)}
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

      <Separator />

      {/* Country */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('country')}</label>

        {/* Search input */}
        <input
          type="text"
          value={countrySearch}
          onChange={e => setCountrySearch(e.target.value)}
          placeholder={t('countryPlaceholder')}
          className="w-full h-8 px-3 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground mt-1"
        />

        {/* Selected countries — shown below search as active chips */}
        {store.countries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {store.countries.map((code) => {
              const country = countries.find(c => c.iso_3166_1 === code)
              return (
                <button
                  key={code}
                  onClick={() => store.toggleCountry(code)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all bg-primary text-primary-foreground border-primary"
                >
                  {getCountryName(code, country?.english_name ?? code)}
                </button>
              )
            })}
          </div>
        )}

        {/* Filtered country chips — scrollable */}
        <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto">
          {filteredCountries.map((country) => (
            <button
              key={country.iso_3166_1}
              onClick={() => {
                store.toggleCountry(country.iso_3166_1)
                setCountrySearch('')
              }}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                'border-border text-muted-foreground hover:border-primary hover:text-primary'
              )}
            >
              {getCountryName(country.iso_3166_1, country.english_name)}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Year range */}
      <div className="space-y-3">
        <label className="text-sm font-medium">{t('year')}</label>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
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

      <Separator />

      {/* Vote count */}
      <div className="space-y-3">
        <label className="text-sm font-medium">{t('votes')}</label>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>{store.voteCountMin === 0 ? '0' : `${store.voteCountMin / 1000}K`}</span>
          <span>—</span>
          <span>{store.voteCountMax >= VOTE_COUNT_MAX ? `${VOTE_COUNT_MAX / 1000}K+` : `${store.voteCountMax / 1000}K`}</span>
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
