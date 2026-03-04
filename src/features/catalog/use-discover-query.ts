'use client'

import { useQuery } from '@tanstack/react-query'
import { useLocale } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { tmdbMovies, tmdbShows } from '@/lib/tmdb'
import type { TMDBResponse, Movie, TVShow, DiscoverMovieFilters, DiscoverTVFilters } from '@/types/tmdb'
import type { MediaType, PersonFilter } from '@/types/app'
import { CURRENT_YEAR, MIN_YEAR } from '@/lib/constants'

export type DiscoverResult = TMDBResponse<Movie | TVShow>
type QueryKey = (string | number | number[] | string[] | PersonFilter[] | PersonFilter | null)[]

export const useDiscoverQuery = (mediaType: MediaType) => {
  const locale = useLocale()
  const store = useFiltersStore()

  const buildMovieFilters = (): DiscoverMovieFilters => {
    const filters: DiscoverMovieFilters = { sort_by: store.sortBy, page: store.page }
    if (store.genres.length) filters.with_genres = store.genres.join(',')
    if (store.countries.length) filters.with_origin_country = store.countries.join('|')
    if (store.yearFrom !== MIN_YEAR) filters['primary_release_date.gte'] = `${store.yearFrom}-01-01`
    if (store.yearTo !== CURRENT_YEAR) filters['primary_release_date.lte'] = `${store.yearTo}-12-31`
    if (store.ratingFrom > 0) filters['vote_average.gte'] = store.ratingFrom
    if (store.ratingTo < 10) filters['vote_average.lte'] = store.ratingTo
    if (store.voteCountMin > 0) filters['vote_count.gte'] = store.voteCountMin
    if (store.actors.length) filters.with_cast = store.actors.map((a) => a.id).join(',')
    if (store.director) filters.with_crew = String(store.director.id)
    return filters
  }

  const buildTVFilters = (): DiscoverTVFilters => {
    const filters: DiscoverTVFilters = { sort_by: store.sortBy, page: store.page }
    if (store.genres.length) filters.with_genres = store.genres.join(',')
    if (store.countries.length) filters.with_origin_country = store.countries.join('|')
    if (store.yearFrom !== MIN_YEAR) filters['first_air_date.gte'] = `${store.yearFrom}-01-01`
    if (store.yearTo !== CURRENT_YEAR) filters['first_air_date.lte'] = `${store.yearTo}-12-31`
    if (store.ratingFrom > 0) filters['vote_average.gte'] = store.ratingFrom
    if (store.ratingTo < 10) filters['vote_average.lte'] = store.ratingTo
    if (store.voteCountMin > 0) filters['vote_count.gte'] = store.voteCountMin
    if (store.actors.length) filters.with_cast = store.actors.map((a) => a.id).join(',')
    return filters
  }

  const queryKey: QueryKey = [
    'discover', mediaType, locale,
    store.genres, store.countries,
    store.yearFrom, store.yearTo,
    store.ratingFrom, store.ratingTo,
    store.voteCountMin,
    store.actors, store.director,
    store.sortBy, store.page,
  ]

  const queryFn = async (): Promise<DiscoverResult> => {
    if (mediaType === 'movie') {
      const res = await tmdbMovies.discover(buildMovieFilters(), locale)
      return res as DiscoverResult
    }
    const res = await tmdbShows.discover(buildTVFilters(), locale)
    return res as DiscoverResult
  }

  return useQuery<DiscoverResult, Error, DiscoverResult, QueryKey>({
    queryKey,
    queryFn,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  })
}
