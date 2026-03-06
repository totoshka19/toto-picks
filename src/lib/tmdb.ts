import type {
  TMDBResponse,
  Movie,
  MovieDetail,
  TVShow,
  TVShowDetail,
  Person,
  PersonDetail,
  MovieCreditsResponse,
  MultiSearchResult,
  Genre,
  TMDBCountry,
  DiscoverMovieFilters,
  DiscoverTVFilters,
} from '@/types/tmdb'
import { TMDB_IMAGE_BASE, TMDB_LANGUAGE_MAP } from './constants'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!key || key === 'your_tmdb_api_key_here') {
    console.warn('TMDB API key is not set. Add NEXT_PUBLIC_TMDB_API_KEY to .env.local')
    return ''
  }
  return key
}

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
  locale = 'ru'
): Promise<T> {
  const language = TMDB_LANGUAGE_MAP[locale] ?? 'ru-RU'
  const searchParams = new URLSearchParams({
    api_key: getApiKey(),
    language,
    ...Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)])
    ),
  })

  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`
  const res = await fetch(url, {
    next: { revalidate: 3600 }, // cache for 1 hour
  })

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText} (${endpoint})`)
  }

  return res.json() as Promise<T>
}

// ─── Image helpers ───────────────────────────────────────────────────────────

export function tmdbImage(
  path: string | null | undefined,
  size: string = 'w500'
): string | null {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function tmdbPoster(path: string | null | undefined, size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string | null {
  const sizes = { sm: 'w200', md: 'w342', lg: 'w500', xl: 'w780' }
  return tmdbImage(path, sizes[size])
}

export function tmdbBackdrop(path: string | null | undefined, size: 'sm' | 'md' | 'lg' = 'lg'): string | null {
  const sizes = { sm: 'w300', md: 'w780', lg: 'w1280' }
  return tmdbImage(path, sizes[size])
}

export function tmdbProfile(path: string | null | undefined, size: 'sm' | 'md' | 'lg' = 'md'): string | null {
  const sizes = { sm: 'w45', md: 'w185', lg: 'h632' }
  return tmdbImage(path, sizes[size])
}

// ─── Movies ──────────────────────────────────────────────────────────────────

export const tmdbMovies = {
  trending: (locale = 'ru') =>
    fetchTMDB<TMDBResponse<Movie>>('/trending/movie/week', {}, locale),

  nowPlaying: (page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<Movie>>('/movie/now_playing', { page }, locale),

  popular: (page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<Movie>>('/movie/popular', { page }, locale),

  topRated: (page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<Movie>>('/movie/top_rated', { page }, locale),

  discover: (filters: DiscoverMovieFilters, locale = 'ru') =>
    fetchTMDB<TMDBResponse<Movie>>('/discover/movie', filters as Record<string, string | number>, locale),

  detail: (id: number, locale = 'ru') =>
    fetchTMDB<MovieDetail>(
      `/movie/${id}`,
      { append_to_response: 'credits,similar,videos' },
      locale
    ),

  meta: (id: number, locale = 'ru') =>
    fetchTMDB<{ vote_count: number; origin_country?: string[] }>(`/movie/${id}`, {}, locale),
}

// ─── TV Shows ────────────────────────────────────────────────────────────────

export const tmdbShows = {
  trending: (locale = 'ru') =>
    fetchTMDB<TMDBResponse<TVShow>>('/trending/tv/week', {}, locale),

  onTheAir: (page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<TVShow>>('/tv/on_the_air', { page }, locale),

  popular: (page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<TVShow>>('/tv/popular', { page }, locale),

  topRated: (page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<TVShow>>('/tv/top_rated', { page }, locale),

  discover: (filters: DiscoverTVFilters, locale = 'ru') =>
    fetchTMDB<TMDBResponse<TVShow>>('/discover/tv', filters as Record<string, string | number>, locale),

  detail: (id: number, locale = 'ru') =>
    fetchTMDB<TVShowDetail>(
      `/tv/${id}`,
      { append_to_response: 'credits,similar,videos' },
      locale
    ),

  meta: (id: number, locale = 'ru') =>
    fetchTMDB<{ vote_count: number; origin_country: string[] }>(`/tv/${id}`, {}, locale),
}

// ─── Genres ──────────────────────────────────────────────────────────────────

export const tmdbGenres = {
  movies: (locale = 'ru') =>
    fetchTMDB<{ genres: Genre[] }>('/genre/movie/list', {}, locale),

  shows: (locale = 'ru') =>
    fetchTMDB<{ genres: Genre[] }>('/genre/tv/list', {}, locale),
}

// ─── Countries ───────────────────────────────────────────────────────────────
// Returns all ~250 TMDB-supported countries with english_name and native_name.
// Note: the language param does not translate country names on this endpoint.

export const tmdbCountries = {
  list: () =>
    fetchTMDB<TMDBCountry[]>('/configuration/countries', {}),
}

// ─── Search ──────────────────────────────────────────────────────────────────

export const tmdbSearch = {
  multi: (query: string, page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<MultiSearchResult>>('/search/multi', { query, page }, locale),

  movies: (query: string, page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<Movie>>('/search/movie', { query, page }, locale),

  shows: (query: string, page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<TVShow>>('/search/tv', { query, page }, locale),

  person: (query: string, page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<Person>>('/search/person', { query, page }, locale),
}

// ─── Person ──────────────────────────────────────────────────────────────────

export const tmdbPerson = {
  detail: (id: number, locale = 'ru') =>
    fetchTMDB<PersonDetail>(
      `/person/${id}`,
      { append_to_response: 'movie_credits,tv_credits' },
      locale
    ),

  // Full filmography — more complete than /discover?with_crew
  movieCredits: (id: number, locale = 'ru') =>
    fetchTMDB<MovieCreditsResponse>(`/person/${id}/movie_credits`, {}, locale),

  popular: (page = 1, locale = 'ru') =>
    fetchTMDB<TMDBResponse<Person>>('/person/popular', { page }, locale),
}
