'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useQueries } from '@tanstack/react-query'
import { useFavoritesStore } from '@/store/favorites'
import { MovieCard } from '@/components/cards/movie-card'
import { EmptyState } from '@/components/empty-state'
import { Heart } from 'lucide-react'
import { tmdbMovies, tmdbShows } from '@/lib/tmdb'
import type { Movie, TVShow, Genre } from '@/types/tmdb'

interface Props {
  movieGenres: Genre[]
  tvGenres: Genre[]
}

export const FavoritesContent = ({ movieGenres, tvGenres }: Props) => {
  const t = useTranslations('favorites')
  const locale = useLocale()
  const items = useFavoritesStore((s) => s.items)

  const metaQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: ['item-meta', item.mediaType, item.id, locale],
      queryFn: () => item.mediaType === 'movie'
        ? tmdbMovies.meta(item.id, locale)
        : tmdbShows.meta(item.id, locale),
      staleTime: 10 * 60 * 1000,
    })),
  })

  const metaMap = new Map(
    items.map((item, i) => [`${item.mediaType}-${item.id}`, metaQueries[i]?.data])
  )

  const toMovieItem = (item: typeof items[number]): Movie | TVShow => {
    const meta = metaMap.get(`${item.mediaType}-${item.id}`)
    return ({
      id: item.id,
      ...(item.mediaType === 'movie'
        ? { title: item.title, original_title: item.title, release_date: item.releaseDate }
        : { name: item.title, original_name: item.title, first_air_date: item.releaseDate, origin_country: meta?.origin_country ?? item.originCountry ?? [] }),
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
    } as Movie | TVShow)
  }

  const movies = items.filter((i) => i.mediaType === 'movie')
  const shows = items.filter((i) => i.mediaType === 'tv')

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 min-[576px]:px-8 py-10">
        <h1 className="text-2xl font-bold mb-8">{t('title')}</h1>
        <EmptyState
          title={t('empty')}
          description={t('emptyDesc')}
          icon={<Heart className="h-16 w-16 opacity-30" />}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 min-[576px]:px-8 py-10 space-y-10">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      {movies.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            {t('movies')} ({movies.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {movies.map((item) => (
              <MovieCard key={item.id} item={toMovieItem(item)} mediaType="movie" genres={movieGenres} />
            ))}
          </div>
        </section>
      )}

      {shows.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            {t('shows')} ({shows.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {shows.map((item) => (
              <MovieCard key={item.id} item={toMovieItem(item)} mediaType="tv" genres={tvGenres} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
