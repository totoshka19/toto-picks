export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const TMDB_IMAGE_SIZES = {
  poster: {
    sm: 'w200',
    md: 'w342',
    lg: 'w500',
    xl: 'w780',
    original: 'original',
  },
  backdrop: {
    sm: 'w300',
    md: 'w780',
    lg: 'w1280',
    original: 'original',
  },
  profile: {
    sm: 'w45',
    md: 'w185',
    lg: 'h632',
    original: 'original',
  },
} as const

export const SORT_OPTIONS = [
  { value: 'popularity.desc', labelKey: 'popularityDesc' },
  { value: 'popularity.asc', labelKey: 'popularityAsc' },
  { value: 'vote_average.desc', labelKey: 'ratingDesc' },
  { value: 'vote_average.asc', labelKey: 'ratingAsc' },
  { value: 'primary_release_date.desc', labelKey: 'releaseDateDesc' },
  { value: 'primary_release_date.asc', labelKey: 'releaseDateAsc' },
  { value: 'vote_count.desc', labelKey: 'voteCountDesc' },
] as const

export const SORT_OPTIONS_TV = [
  { value: 'popularity.desc', labelKey: 'popularityDesc' },
  { value: 'popularity.asc', labelKey: 'popularityAsc' },
  { value: 'vote_average.desc', labelKey: 'ratingDesc' },
  { value: 'vote_average.asc', labelKey: 'ratingAsc' },
  { value: 'first_air_date.desc', labelKey: 'releaseDateDesc' },
  { value: 'first_air_date.asc', labelKey: 'releaseDateAsc' },
  { value: 'vote_count.desc', labelKey: 'voteCountDesc' },
] as const

export const VOTE_COUNT_OPTIONS = [
  { value: 0, labelKey: 'any' },
  { value: 100, label: '100+' },
  { value: 500, label: '500+' },
  { value: 1000, label: '1 000+' },
  { value: 5000, label: '5 000+' },
  { value: 10000, label: '10 000+' },
  { value: 50000, label: '50 000+' },
] as const

export const CURRENT_YEAR = new Date().getFullYear()
export const MIN_YEAR = 1900
export const MAX_YEAR = CURRENT_YEAR

export const DEFAULT_FILTERS = {
  genres: [] as number[],
  countries: [] as string[],
  yearFrom: MIN_YEAR,
  yearTo: MAX_YEAR,
  ratingFrom: 0,
  ratingTo: 10,
  voteCountMin: 0,
  actors: [] as { id: number; name: string }[],
  director: null as { id: number; name: string } | null,
  sortBy: 'popularity.desc',
  page: 1,
}

export const TMDB_LANGUAGE_MAP: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
}

export const LOCALES = ['ru', 'en'] as const
export const DEFAULT_LOCALE = 'ru' as const

// Top countries for filter (ISO 3166-1 alpha-2)
export const POPULAR_COUNTRIES = [
  { code: 'US', nameRu: 'США', nameEn: 'USA' },
  { code: 'GB', nameRu: 'Великобритания', nameEn: 'United Kingdom' },
  { code: 'FR', nameRu: 'Франция', nameEn: 'France' },
  { code: 'DE', nameRu: 'Германия', nameEn: 'Germany' },
  { code: 'IT', nameRu: 'Италия', nameEn: 'Italy' },
  { code: 'ES', nameRu: 'Испания', nameEn: 'Spain' },
  { code: 'JP', nameRu: 'Япония', nameEn: 'Japan' },
  { code: 'KR', nameRu: 'Южная Корея', nameEn: 'South Korea' },
  { code: 'CN', nameRu: 'Китай', nameEn: 'China' },
  { code: 'IN', nameRu: 'Индия', nameEn: 'India' },
  { code: 'RU', nameRu: 'Россия', nameEn: 'Russia' },
  { code: 'AU', nameRu: 'Австралия', nameEn: 'Australia' },
  { code: 'CA', nameRu: 'Канада', nameEn: 'Canada' },
  { code: 'SE', nameRu: 'Швеция', nameEn: 'Sweden' },
  { code: 'DK', nameRu: 'Дания', nameEn: 'Denmark' },
  { code: 'NO', nameRu: 'Норвегия', nameEn: 'Norway' },
  { code: 'BR', nameRu: 'Бразилия', nameEn: 'Brazil' },
  { code: 'MX', nameRu: 'Мексика', nameEn: 'Mexico' },
  { code: 'TR', nameRu: 'Турция', nameEn: 'Turkey' },
  { code: 'PL', nameRu: 'Польша', nameEn: 'Poland' },
] as const

export const FAVORITES_STORAGE_KEY = 'toto-picks-favorites'
