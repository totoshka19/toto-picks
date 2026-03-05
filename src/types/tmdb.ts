// TMDB API Types

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

// Normalized item for hero carousel (mix of movies and TV shows)
export interface HeroItem {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  genre_names: string[]
  origin_country?: string[]
  year: number | null
  media_type: 'movie' | 'tv'
}

// List item (used in discover, trending, search results)
export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  adult: boolean
  original_language: string
  origin_country?: string[]
  video: boolean
}

// Full detail (used in /movie/[id])
export interface MovieDetail {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genres: Genre[]
  popularity: number
  adult: boolean
  original_language: string
  runtime: number | null
  budget: number
  revenue: number
  status: string
  tagline: string
  homepage: string | null
  imdb_id: string | null
  origin_country?: string[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  credits: Credits
  similar: TMDBResponse<Movie>
  videos: VideoResults
}

// List item for TV shows
export interface TVShow {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  original_language: string
  origin_country: string[]
}

// Full detail for TV shows
export interface TVShowDetail {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  last_air_date: string
  vote_average: number
  vote_count: number
  genres: Genre[]
  popularity: number
  original_language: string
  origin_country: string[]
  number_of_seasons: number
  number_of_episodes: number
  status: string
  tagline: string
  homepage: string | null
  in_production: boolean
  type: string
  seasons: Season[]
  production_companies: ProductionCompany[]
  credits: Credits
  similar: TMDBResponse<TVShow>
  videos: VideoResults
}

export interface Season {
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  episode_count: number
  air_date: string | null
  vote_average: number
}

export interface Episode {
  id: number
  name: string
  overview: string
  still_path: string | null
  air_date: string | null
  episode_number: number
  season_number: number
  vote_average: number
  vote_count: number
  runtime: number | null
}

export interface Cast {
  id: number
  name: string
  original_name: string
  character: string
  profile_path: string | null
  order: number
  known_for_department: string
}

export interface Crew {
  id: number
  name: string
  original_name: string
  job: string
  department: string
  profile_path: string | null
  known_for_department: string
}

export interface Credits {
  cast: Cast[]
  crew: Crew[]
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
}

export interface VideoResults {
  results: Video[]
}

// Standalone response from /person/{id}/movie_credits
export interface MovieCreditsResponse {
  cast: (Movie & { character: string; order: number })[]
  crew: (Movie & { job: string; department: string })[]
}

// Person types
export interface Person {
  id: number
  name: string
  profile_path: string | null
  known_for_department: string
  popularity: number
  known_for?: (Movie | TVShow)[]
}

export interface PersonDetail {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
  popularity: number
  homepage: string | null
  imdb_id: string | null
  also_known_as: string[]
  movie_credits: MovieCreditsResponse
  tv_credits: {
    cast: (TVShow & { character: string })[]
    crew: (TVShow & { job: string; department: string })[]
  }
}

// Multi-search result
export type MultiSearchResult =
  | (Movie & { media_type: 'movie' })
  | (TVShow & { media_type: 'tv' })
  | (Person & { media_type: 'person' })

// Discover filters
export interface DiscoverMovieFilters {
  with_genres?: string
  with_origin_country?: string
  'primary_release_date.gte'?: string
  'primary_release_date.lte'?: string
  'vote_average.gte'?: number
  'vote_average.lte'?: number
  'vote_count.gte'?: number
  with_cast?: string
  with_crew?: string
  sort_by?: string
  page?: number
  language?: string
}

export interface DiscoverTVFilters {
  with_genres?: string
  with_origin_country?: string
  'first_air_date.gte'?: string
  'first_air_date.lte'?: string
  'vote_average.gte'?: number
  'vote_average.lte'?: number
  'vote_count.gte'?: number
  with_cast?: string
  sort_by?: string
  page?: number
  language?: string
}
