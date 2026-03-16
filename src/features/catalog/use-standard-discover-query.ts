'use client'

import { useQuery } from '@tanstack/react-query'
import { useLocale } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { tmdbMovies, tmdbShows } from '@/lib/tmdb'
import { buildMovieFilters, buildTVFilters } from './build-discover-filters'
import type { TMDBResponse, Movie, TVShow } from '@/types/tmdb'
import type { MediaType, PersonFilter } from '@/types/app'

type DiscoverResult = TMDBResponse<Movie | TVShow>
type QueryKey = (string | number | number[] | string[] | PersonFilter[] | PersonFilter | null)[]

/**
 * Runs the standard TMDB /discover endpoint for movies or TV shows.
 * Disabled automatically when director mode is active (handled by the orchestrator).
 */
export const useStandardDiscoverQuery = (mediaType: MediaType, enabled: boolean) => {
  const locale = useLocale()
  const store = useFiltersStore()

  const queryKey: QueryKey = [
    'discover', mediaType, locale,
    store.genres, store.countries,
    store.yearFrom, store.yearTo,
    store.ratingFrom, store.ratingTo,
    store.voteCountMin, store.voteCountMax,
    store.actors, store.director,
    store.sortBy, store.page,
  ]

  return useQuery<DiscoverResult, Error, DiscoverResult, QueryKey>({
    queryKey,
    queryFn: async () => {
      if (mediaType === 'movie') {
        const res = await tmdbMovies.discover(buildMovieFilters(store), locale)
        return res as DiscoverResult
      }
      const res = await tmdbShows.discover(buildTVFilters(store), locale)
      return res as DiscoverResult
    },
    enabled,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
