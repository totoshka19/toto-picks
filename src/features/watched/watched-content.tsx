'use client'

import { useTranslations } from 'next-intl'
import { useWatchedStore } from '@/store/watched'
import { MovieCard } from '@/components/cards/movie-card'
import { EmptyState } from '@/components/empty-state'
import { Eye } from 'lucide-react'
import { storedItemToMedia } from '@/lib/helpers'
import type { Genre } from '@/types/tmdb'

interface Props {
  movieGenres: Genre[]
  tvGenres: Genre[]
}

export const WatchedContent = ({ movieGenres, tvGenres }: Props) => {
  const t = useTranslations('watched')
  const items = useWatchedStore((s) => s.items)

  const movies = items.filter((i) => i.mediaType === 'movie')
  const shows = items.filter((i) => i.mediaType === 'tv')

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 min-[576px]:px-8 py-10">
        <EmptyState
          title={t('empty')}
          description={t('emptyDesc')}
          icon={<Eye className="h-16 w-16 opacity-30" />}
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
              <MovieCard key={item.id} item={storedItemToMedia(item)} mediaType="movie" genres={movieGenres} />
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
              <MovieCard key={item.id} item={storedItemToMedia(item)} mediaType="tv" genres={tvGenres} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
