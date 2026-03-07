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
  voteCountMax: 50000,
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

// Countries with notable film/TV industries, ordered by cinematic prominence.
// Order determines the display ranking in the country filter sidebar.
// Excludes micro-territories and dependencies with no meaningful cinema.
export const FILM_COUNTRIES_ORDERED = [
  // Tier 1 — Major global film industries
  'US', 'GB', 'FR', 'JP', 'DE', 'KR', 'IN', 'IT', 'CN', 'ES',
  // Tier 2 — Strong international presence
  'RU', 'AU', 'CA', 'BR', 'MX', 'SE', 'TR', 'PL', 'DK', 'NO',
  // Tier 3 — Notable European
  'NL', 'BE', 'HU', 'CZ', 'RO', 'PT', 'GR', 'AT', 'CH', 'IE',
  'FI', 'IS', 'UA', 'BG', 'RS', 'HR', 'SK', 'BY', 'LT', 'LV', 'EE',
  // Tier 4 — Asia, Middle East, North Africa
  'HK', 'TW', 'TH', 'IR', 'IL', 'VN', 'PH', 'ID', 'SG', 'MY',
  'EG', 'MA', 'SA', 'AE', 'LB', 'IQ', 'JO', 'SY', 'KW', 'QA',
  // Tier 5 — Latin America (beyond top), Sub-Saharan Africa, rest of Asia
  'AR', 'CO', 'CL', 'PE', 'CU', 'VE', 'UY', 'EC', 'BO',
  'NG', 'ZA', 'KE', 'GH', 'SN', 'ET', 'CI', 'CM', 'TZ',
  'PK', 'BD', 'LK', 'NP', 'MM', 'KH', 'MN', 'AF', 'LA',
  // Tier 6 — Smaller but represented in TMDB
  'SI', 'BA', 'MK', 'AL', 'ME', 'MD', 'GE', 'AM', 'AZ',
  'KZ', 'UZ', 'LU', 'DZ', 'TN', 'LY', 'YE', 'BH', 'NZ',
  'GT', 'CR', 'PA', 'DO', 'CU', 'JM', 'HT', 'TT', 'PY', 'PG', 'FJ',
  // Historical/special TMDB codes (notable cinematographic heritage)
  'XC', 'XG', 'XK',
]

// Set for O(1) membership checks
export const FILM_COUNTRIES = new Set(FILM_COUNTRIES_ORDERED)

export const FAVORITES_STORAGE_KEY = 'toto-picks-favorites'
export const WATCHED_STORAGE_KEY = 'toto-picks-watched'
