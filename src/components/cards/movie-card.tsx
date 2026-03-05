'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Heart, Star, Eye, Users } from 'lucide-react'
import { cn, formatVotes } from '@/lib/utils'
import { tmdbPoster } from '@/lib/tmdb'
import { useFavoritesStore } from '@/store/favorites'
import { useWatchedStore } from '@/store/watched'
import { Skeleton } from '@/components/ui/skeleton'
import type { Movie, TVShow } from '@/types/tmdb'
import type { MediaType } from '@/types/app'

interface MovieCardProps {
  item: Movie | TVShow
  mediaType: MediaType
  genres?: { id: number; name: string }[]
}

const isMovie = (item: Movie | TVShow): item is Movie => 'title' in item

export const MovieCard = ({ item, mediaType, genres }: MovieCardProps) => {
  const title = isMovie(item) ? item.title : item.name
  const date = isMovie(item) ? item.release_date : item.first_air_date
  const year = date ? new Date(date).getFullYear() : null
  const posterUrl = tmdbPoster(item.poster_path, 'md')
  const href = mediaType === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`

  const favorites = useFavoritesStore()
  const watchedStore = useWatchedStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isFavorite = mounted && favorites.has(item.id, mediaType)
  const isWatched = mounted && watchedStore.has(item.id, mediaType)

  const itemGenres = genres
    ? item.genre_ids?.slice(0, 2).map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean)
    : []

  const buildItem = () => ({
    id: item.id,
    mediaType,
    title,
    posterPath: item.poster_path,
    voteAverage: item.vote_average,
    releaseDate: date ?? '',
    genreIds: item.genre_ids ?? [],
  })

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite) {
      favorites.remove(item.id, mediaType)
    } else {
      favorites.add(buildItem())
    }
  }

  const toggleWatched = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWatched) {
      watchedStore.remove(item.id, mediaType)
    } else {
      watchedStore.add(buildItem())
    }
  }

  const rating = item.vote_average
  const ratingColor =
    rating >= 7 ? 'text-green-400' : rating >= 5 ? 'text-yellow-400' : 'text-red-400'

  return (
    <Link href={href} className="group block h-full">
      <div className="relative overflow-hidden rounded-lg bg-card h-full flex flex-col">
        {/* Poster */}
        <div className="relative aspect-[2/3] shrink-0 overflow-hidden bg-muted">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span className="text-xs">No poster</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

          {/* Action buttons (watched + favorite) */}
          <div className="absolute top-2 right-2 flex flex-row gap-1.5">
            <button
              onClick={toggleWatched}
              className={cn(
                'rounded-full p-1.5 backdrop-blur-sm transition-all',
                'opacity-0 group-hover:opacity-100',
                isWatched
                  ? 'bg-primary text-primary-foreground opacity-100'
                  : 'bg-black/50 text-white hover:text-primary'
              )}
              aria-label={isWatched ? 'Remove from watched' : 'Mark as watched'}
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              onClick={toggleFavorite}
              className={cn(
                'rounded-full p-1.5 backdrop-blur-sm transition-all',
                'opacity-0 group-hover:opacity-100',
                isFavorite
                  ? 'bg-primary text-primary-foreground opacity-100'
                  : 'bg-black/50 text-white hover:text-primary'
              )}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          {/* Rating + votes badges (always visible) */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <div className={cn('flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold backdrop-blur-sm', ratingColor)}>
              <Star className="h-3 w-3 fill-current" />
              {rating.toFixed(1)}
            </div>
            {item.vote_count > 0 && (
              <div className="flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-xs text-white/70 backdrop-blur-sm">
                <Users className="h-3 w-3" />
                {formatVotes(item.vote_count)}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-2 flex-1">
          <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {year && <span>{year}</span>}
            {itemGenres && itemGenres.length > 0 && (
              <>
                <span>·</span>
                <span className="line-clamp-1">{itemGenres.join(', ')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export const MovieCardSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-card">
    <Skeleton className="aspect-[2/3] w-full" />
    <div className="p-2 space-y-1.5">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </div>
)
