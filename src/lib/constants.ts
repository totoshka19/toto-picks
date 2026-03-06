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
  { value: 'vote_count.asc', labelKey: 'voteCountAsc' },
] as const

export const SORT_OPTIONS_TV = [
  { value: 'popularity.desc', labelKey: 'popularityDesc' },
  { value: 'popularity.asc', labelKey: 'popularityAsc' },
  { value: 'vote_average.desc', labelKey: 'ratingDesc' },
  { value: 'vote_average.asc', labelKey: 'ratingAsc' },
  { value: 'first_air_date.desc', labelKey: 'releaseDateDesc' },
  { value: 'first_air_date.asc', labelKey: 'releaseDateAsc' },
  { value: 'vote_count.desc', labelKey: 'voteCountDesc' },
  { value: 'vote_count.asc', labelKey: 'voteCountAsc' },
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

// Countries with notable film/TV industries — used to filter the full TMDB list.
// Excludes micro-territories, uninhabited islands, and overseas dependencies
// that have no meaningful cinema production.
export const FILM_COUNTRIES = new Set([
  // North America
  'US', 'CA', 'MX',
  // Central America & Caribbean
  'GT', 'SV', 'HN', 'NI', 'CR', 'PA', 'CU', 'DO', 'JM', 'HT', 'TT',
  // South America
  'BR', 'AR', 'CO', 'CL', 'PE', 'VE', 'UY', 'EC', 'BO', 'PY',
  // Western Europe
  'GB', 'FR', 'DE', 'IT', 'ES', 'PT', 'NL', 'BE', 'CH', 'AT', 'IE', 'LU',
  // Nordic
  'SE', 'DK', 'NO', 'FI', 'IS',
  // Eastern Europe
  'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'GR', 'RS', 'HR', 'SI', 'BA', 'MK', 'AL', 'ME',
  // Former Soviet
  'RU', 'UA', 'BY', 'MD', 'GE', 'AM', 'AZ', 'KZ', 'UZ', 'KG', 'TJ', 'TM',
  // Baltic
  'LT', 'LV', 'EE',
  // Middle East
  'TR', 'IL', 'IR', 'LB', 'EG', 'SA', 'AE', 'IQ', 'JO', 'SY', 'YE', 'KW', 'QA', 'BH',
  // Africa
  'MA', 'TN', 'DZ', 'LY', 'NG', 'ZA', 'KE', 'GH', 'ET', 'SN', 'CM', 'CI', 'TZ', 'UG', 'RW',
  // South & Central Asia
  'IN', 'PK', 'BD', 'LK', 'NP', 'AF',
  // East Asia
  'CN', 'JP', 'KR', 'TW', 'HK', 'MN',
  // Southeast Asia
  'TH', 'VN', 'PH', 'ID', 'MY', 'SG', 'MM', 'KH', 'LA',
  // Oceania
  'AU', 'NZ', 'PG', 'FJ',
  // Historical/special TMDB codes (notable cinematographic heritage)
  'XC', 'XG', 'XK',
])

export const FAVORITES_STORAGE_KEY = 'toto-picks-favorites'
export const WATCHED_STORAGE_KEY = 'toto-picks-watched'
