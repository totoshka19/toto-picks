'use client'

import { useQuery } from '@tanstack/react-query'
import { useLocale } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { tmdbPerson } from '@/lib/tmdb'
import type { TMDBResponse, Movie, TVShow } from '@/types/tmdb'
import type { MediaType } from '@/types/app'
import { CURRENT_YEAR, MIN_YEAR } from '@/lib/constants'

type DiscoverResult = TMDBResponse<Movie | TVShow>
type DirectorMovie = Movie & { job: string; department: string }

const ITEMS_PER_PAGE = 20

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
      va = a.popularity; vb = b.popularity
    }

    return asc ? va - vb : vb - va
  })
}

/**
 * Fetches a director's complete filmography via /person/{id}/movie_credits,
 * then applies client-side filtering, sorting, and pagination.
 *
 * Key does NOT include `page` — the full filmography is cached once and
 * paginated locally without extra network requests.
 *
 * Only active when mediaType === 'movie' and a director filter is set.
 */
export const useDirectorFilmographyQuery = (mediaType: MediaType) => {
  const locale = useLocale()
  const store = useFiltersStore()
  const isDirectorMode = mediaType === 'movie' && !!store.director

  const filmographyQuery = useQuery({
    queryKey: ['person-credits', store.director?.id ?? null, locale] as const,
    queryFn: () => tmdbPerson.movieCredits(store.director!.id, locale),
    enabled: isDirectorMode,
    staleTime: 1000 * 60 * 30, // 30 min — filmography rarely changes
  })

  let data: DiscoverResult | undefined

  if (filmographyQuery.data && isDirectorMode) {
    const seen = new Set<number>()
    const directorMovies = filmographyQuery.data.crew.filter((m) => {
      if (m.job !== 'Director' || seen.has(m.id)) return false
      seen.add(m.id)
      return true
    }) as DirectorMovie[]

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

    data = {
      page: store.page,
      results: sorted.slice(start, start + ITEMS_PER_PAGE) as (Movie | TVShow)[],
      total_pages: totalPages,
      total_results: totalResults,
    }
  }

  return { ...filmographyQuery, data }
}
