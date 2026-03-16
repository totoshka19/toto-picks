'use client'

import { useMemo, useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { FILM_COUNTRIES, FILM_COUNTRIES_ORDERED } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { TMDBCountry } from '@/types/tmdb'

interface FilterCountriesProps {
  countries: TMDBCountry[]
}

export const FilterCountries = ({ countries }: FilterCountriesProps) => {
  const t = useTranslations('filters')
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

  // Priority index map for O(1) sort lookup
  const priorityMap = useMemo(
    () => new Map(FILM_COUNTRIES_ORDERED.map((code, i) => [code, i])),
    []
  )

  // Without search: sorted by cinematic prominence; with search: alphabetical among matches
  const filteredCountries = useMemo(() => {
    const unselected = countries.filter(
      (c) => FILM_COUNTRIES.has(c.iso_3166_1) && !store.countries.includes(c.iso_3166_1)
    )
    if (!countrySearch.trim()) {
      return [...unselected].sort(
        (a, b) => (priorityMap.get(a.iso_3166_1) ?? 999) - (priorityMap.get(b.iso_3166_1) ?? 999)
      )
    }
    const q = countrySearch.toLowerCase()
    return unselected
      .filter((c) => getCountryName(c.iso_3166_1, c.english_name).toLowerCase().includes(q))
      .sort((a, b) =>
        getCountryName(a.iso_3166_1, a.english_name).localeCompare(
          getCountryName(b.iso_3166_1, b.english_name), locale
        )
      )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, store.countries, countrySearch, countryNames, locale, priorityMap])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t('country')}</label>

      {/* Search input */}
      <input
        type="text"
        value={countrySearch}
        onChange={(e) => setCountrySearch(e.target.value)}
        placeholder={t('countryPlaceholder')}
        className="w-full h-8 px-3 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground mt-1"
      />

      {/* Selected countries — shown below search as active chips */}
      {store.countries.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {store.countries.map((code) => {
            const country = countries.find((c) => c.iso_3166_1 === code)
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
  )
}
