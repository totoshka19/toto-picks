'use client'

import { useQuery } from '@tanstack/react-query'
import { useLocale } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { tmdbMovies, tmdbShows, tmdbPerson } from '@/lib/tmdb'
import type { TMDBResponse, Movie, TVShow, DiscoverBaseFilters, DiscoverMovieFilters, DiscoverTVFilters } from '@/types/tmdb'
import type { MediaType, PersonFilter } from '@/types/app'
import { CURRENT_YEAR, MIN_YEAR } from '@/lib/constants'

export type DiscoverResult = TMDBResponse<Movie | TVShow>
type QueryKey = (string | number | number[] | string[] | PersonFilter[] | PersonFilter | null)[]

const ITEMS_PER_PAGE = 20

// ─── Client-side helpers (used when director filter is active) ────────────────

type DirectorMovie = Movie & { job: string; department: string }

function applyClientFilters(
  movies: DirectorMovie[],
  genres: number[],
  yearFrom: number,
  yearTo: number,
  ratingFrom: number,
  ratingTo: number,
  voteCountMin: number
): Movie[] {
  return movies.filter((m) => {
    if (genres.length && !m.genre_ids?.some((id) => genres.includes(id))) return false
    if (yearFrom !== MIN_YEAR || yearTo !== CURRENT_YEAR) {
      const year = m.release_date ? new Date(m.release_date).getFullYear() : 0
      if (year < yearFrom || year > yearTo) return false
    }
    if (ratingFrom > 0 && m.vote_average < ratingFrom) return false
    if (ratingTo < 10 && m.vote_average > ratingTo) return false
    if (voteCountMin > 0 && m.vote_count < voteCountMin) return false
    return true
  })
}

function sortClientMovies(movies: Movie[], sortBy: string): Movie[] {
  const [field, dir] = sortBy.split('.')
  const asc = dir === 'asc'

  return [...movies].sort((a, b) => {
    let va: number
    let vb: number

    if (field === 'vote_average') {
      va = a.vote_average; vb = b.vote_average
    } else if (field === 'primary_release_date') {
      va = a.release_date ? new Date(a.release_date).getTime() : 0
      vb = b.release_date ? new Date(b.release_date).getTime() : 0
    } else if (field === 'vote_count') {
      va = a.vote_count; vb = b.vote_count
    } else {
      // default: popularity
      va = a.popularity; vb = b.popularity
    }

    return asc ? va - vb : vb - va
  })
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export const useDiscoverQuery = (mediaType: MediaType) => {
  const locale = useLocale()
  const store = useFiltersStore()

  const buildCommonFilters = (): DiscoverBaseFilters => {
    const filters: DiscoverBaseFilters = { sort_by: store.sortBy, page: store.page }
    if (store.genres.length) filters.with_genres = store.genres.join('|')
    if (store.countries.length) filters.with_origin_country = store.countries.join('|')
    if (store.ratingFrom > 0) filters['vote_average.gte'] = store.ratingFrom
    if (store.ratingTo < 10) filters['vote_average.lte'] = store.ratingTo
    if (store.voteCountMin > 0) filters['vote_count.gte'] = store.voteCountMin
    if (store.actors.length) filters.with_cast = store.actors.map((a) => a.id).join(',')
    return filters
  }

  const buildMovieFilters = (): DiscoverMovieFilters => {
    const filters: DiscoverMovieFilters = { ...buildCommonFilters() }
    if (store.yearFrom !== MIN_YEAR) filters['primary_release_date.gte'] = `${store.yearFrom}-01-01`
    if (store.yearTo !== CURRENT_YEAR) filters['primary_release_date.lte'] = `${store.yearTo}-12-31`
    if (store.director) filters.with_crew = String(store.director.id)
    return filters
  }

  const buildTVFilters = (): DiscoverTVFilters => {
    const filters: DiscoverTVFilters = { ...buildCommonFilters() }
    if (store.yearFrom !== MIN_YEAR) filters['first_air_date.gte'] = `${store.yearFrom}-01-01`
    if (store.yearTo !== CURRENT_YEAR) filters['first_air_date.lte'] = `${store.yearTo}-12-31`
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
    // ── Director filter: use /person/{id}/movie_credits for full filmography ──
    // TMDB /discover?with_crew only indexes crew partially — many films are missing.
    // /person/{id}/movie_credits returns the complete directorial filmography.
    if (mediaType === 'movie' && store.director) {
      const credits = await tmdbPerson.movieCredits(store.director.id, locale)

      // Keep only directorial credits, deduplicate by id (a film can appear multiple times)
      const seen = new Set<number>()
      const directorMovies = credits.crew.filter((m) => {
        if (m.job !== 'Director' || seen.has(m.id)) return false
        seen.add(m.id)
        return true
      }) as DirectorMovie[]

      // Apply other active filters client-side
      const filtered = applyClientFilters(
        directorMovies,
        store.genres,
        store.yearFrom,
        store.yearTo,
        store.ratingFrom,
        store.ratingTo,
        store.voteCountMin
      )

      const sorted = sortClientMovies(filtered, store.sortBy)
      const totalResults = sorted.length
      const totalPages = Math.min(Math.ceil(totalResults / ITEMS_PER_PAGE), 500)
      const start = (store.page - 1) * ITEMS_PER_PAGE
      const results = sorted.slice(start, start + ITEMS_PER_PAGE)

      return {
        page: store.page,
        results: results as (Movie | TVShow)[],
        total_pages: totalPages,
        total_results: totalResults,
      }
    }

    // ── Default path: TMDB /discover ─────────────────────────────────────────
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
