export type Language = 'ru' | 'en'

export type MediaType = 'movie' | 'tv'

export interface FavoriteItem {
  id: number
  mediaType: MediaType
  title: string
  posterPath: string | null
  voteAverage: number
  releaseDate: string
  genreIds: number[]
}

export interface SortOption {
  value: string
  labelKey: string
}

export interface FilterState {
  genres: number[]
  countries: string[]
  yearFrom: number
  yearTo: number
  ratingFrom: number
  ratingTo: number
  voteCountMin: number
  actors: PersonFilter[]
  director: PersonFilter | null
  sortBy: string
  page: number
}

export interface PersonFilter {
  id: number
  name: string
}
