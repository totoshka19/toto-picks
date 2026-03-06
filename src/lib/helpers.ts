import type { FavoriteItem } from '@/types/app'
import type { Movie, TVShow } from '@/types/tmdb'

interface MediaMeta {
  origin_country?: string[]
  vote_count?: number
}

/** Converts a stored FavoriteItem back into a Movie | TVShow shape for rendering.
 *  Pass `meta` from a live TMDB query to fill in fields that may have changed. */
export const storedItemToMedia = (
  item: FavoriteItem,
  meta?: MediaMeta
): Movie | TVShow =>
  ({
    id: item.id,
    ...(item.mediaType === 'movie'
      ? { title: item.title, original_title: item.title, release_date: item.releaseDate }
      : {
          name: item.title,
          original_name: item.title,
          first_air_date: item.releaseDate,
          origin_country: meta?.origin_country ?? item.originCountry ?? [],
        }),
    overview: '',
    poster_path: item.posterPath,
    backdrop_path: null,
    vote_average: item.voteAverage,
    vote_count: meta?.vote_count ?? item.voteCount ?? 0,
    genre_ids: item.genreIds,
    popularity: 0,
    original_language: '',
    adult: false,
    video: false,
  }) as Movie | TVShow

/** Resolves a ISO 3166-1 alpha-2 country code to a locale-aware display name.
 *  Falls back to the raw code if Intl is unavailable or the code is unknown. */
export const getCountryName = (code: string, locale: string): string => {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}
