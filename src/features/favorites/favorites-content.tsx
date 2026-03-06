'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useQueries } from '@tanstack/react-query'
import { useFavoritesStore } from '@/store/favorites'
import { MovieCard } from '@/components/cards/movie-card'
import { EmptyState } from '@/components/empty-state'
import { Heart } from 'lucide-react'
import { tmdbMovies, tmdbShows } from '@/lib/tmdb'
import { storedItemToMedia } from '@/lib/helpers'
import type { Genre } from '@/types/tmdb'

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

  const movies = items.filter((i) => i.mediaType === 'movie')
  const shows = items.filter((i) => i.mediaType === 'tv')

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 min-[576px]:px-8 py-10">
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
      {movies.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            {t('movies')} ({movies.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {movies.map((item) => (
              <MovieCard key={item.id} item={storedItemToMedia(item, metaMap.get(`${item.mediaType}-${item.id}`))} mediaType="movie" genres={movieGenres} />
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
              <MovieCard key={item.id} item={storedItemToMedia(item, metaMap.get(`${item.mediaType}-${item.id}`))} mediaType="tv" genres={tvGenres} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
