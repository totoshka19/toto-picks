'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useFiltersStore } from '@/store/filters'
import { DEFAULT_FILTERS, MIN_YEAR, CURRENT_YEAR, VOTE_COUNT_MAX } from '@/lib/constants'

// Reads URL params on mount and syncs them to the store — only if URL has params.
// If no URL params, the persisted localStorage state is used as-is.
// Automatically keeps URL in sync with store changes (debounced 300ms).
export const useFiltersUrlSync = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const store = useFiltersStore()

  // URL → Store (on mount, only if URL has filter params)
  useEffect(() => {
    const genres = searchParams.get('genres')
    const countries = searchParams.get('countries')
    const yearFrom = searchParams.get('yearFrom')
    const yearTo = searchParams.get('yearTo')
    const ratingFrom = searchParams.get('ratingFrom')
    const ratingTo = searchParams.get('ratingTo')
    const voteCountMin = searchParams.get('voteCountMin')
    const voteCountMax = searchParams.get('voteCountMax')
    const sortBy = searchParams.get('sortBy')
    const page = searchParams.get('page')

    // If the URL has no filter params, keep persisted state from localStorage
    const hasUrlParams = !!(
      genres || countries || yearFrom || yearTo ||
      ratingFrom || ratingTo || voteCountMin || voteCountMax || sortBy || page
    )
    if (!hasUrlParams) return

    store.setGenres(genres ? genres.split(',').map(Number).filter(Boolean) : [])
    store.setCountries(countries ? countries.split(',').filter(Boolean) : [])
    store.setYearFrom(yearFrom ? Number(yearFrom) : MIN_YEAR)
    store.setYearTo(yearTo ? Number(yearTo) : CURRENT_YEAR)
    store.setRatingFrom(ratingFrom ? Number(ratingFrom) : 0)
    store.setRatingTo(ratingTo ? Number(ratingTo) : 10)
    store.setVoteCountMin(voteCountMin ? Number(voteCountMin) : 0)
    store.setVoteCountMax(voteCountMax ? Number(voteCountMax) : VOTE_COUNT_MAX)
    store.setSortBy(sortBy ?? DEFAULT_FILTERS.sortBy)
    store.setPage(page ? Number(page) : 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Store → URL (auto-sync, debounced 300ms to avoid flooding history on slider drag)
  useEffect(() => {
    const params = new URLSearchParams()
    if (store.genres.length) params.set('genres', store.genres.join(','))
    if (store.countries.length) params.set('countries', store.countries.join(','))
    if (store.yearFrom !== MIN_YEAR) params.set('yearFrom', String(store.yearFrom))
    if (store.yearTo !== CURRENT_YEAR) params.set('yearTo', String(store.yearTo))
    if (store.ratingFrom !== 0) params.set('ratingFrom', String(store.ratingFrom))
    if (store.ratingTo !== 10) params.set('ratingTo', String(store.ratingTo))
    if (store.voteCountMin !== 0) params.set('voteCountMin', String(store.voteCountMin))
    if (store.voteCountMax !== VOTE_COUNT_MAX) params.set('voteCountMax', String(store.voteCountMax))
    if (store.sortBy !== DEFAULT_FILTERS.sortBy) params.set('sortBy', store.sortBy)
    if (store.page !== 1) params.set('page', String(store.page))

    const query = params.toString()
    const timer = setTimeout(() => {
      router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false })
    }, 300)
    return () => clearTimeout(timer)
  }, [
    store.genres, store.countries,
    store.yearFrom, store.yearTo,
    store.ratingFrom, store.ratingTo,
    store.voteCountMin, store.voteCountMax,
    store.actors, store.director,
    store.sortBy, store.page,
    pathname, router,
  ])

  // Kept for mobile: immediately closes the drawer without waiting for debounce
  const pushFiltersToUrl = () => {
    const params = new URLSearchParams()
    if (store.genres.length) params.set('genres', store.genres.join(','))
    if (store.countries.length) params.set('countries', store.countries.join(','))
    if (store.yearFrom !== MIN_YEAR) params.set('yearFrom', String(store.yearFrom))
    if (store.yearTo !== CURRENT_YEAR) params.set('yearTo', String(store.yearTo))
    if (store.ratingFrom !== 0) params.set('ratingFrom', String(store.ratingFrom))
    if (store.ratingTo !== 10) params.set('ratingTo', String(store.ratingTo))
    if (store.voteCountMin !== 0) params.set('voteCountMin', String(store.voteCountMin))
    if (store.voteCountMax !== VOTE_COUNT_MAX) params.set('voteCountMax', String(store.voteCountMax))
    if (store.sortBy !== DEFAULT_FILTERS.sortBy) params.set('sortBy', store.sortBy)
    if (store.page !== 1) params.set('page', String(store.page))

    const query = params.toString()
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false })
  }

  return { pushFiltersToUrl }
}
