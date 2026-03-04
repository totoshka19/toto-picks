'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Play, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { RatingBadge } from '@/components/rating-badge'
import { tmdbBackdrop } from '@/lib/tmdb'
import type { Movie } from '@/types/tmdb'

interface HeroSectionProps {
  movie: Movie
  genres?: { id: number; name: string }[]
  trailerKey?: string
}

export const HeroSection = ({ movie, genres, trailerKey }: HeroSectionProps) => {
  const t = useTranslations('movie')
  const [trailerOpen, setTrailerOpen] = useState(false)

  const backdropUrl = tmdbBackdrop(movie.backdrop_path, 'lg')
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null
  const movieGenres = genres
    ? movie.genre_ids?.slice(0, 3).map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean)
    : []

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden">
      {/* Backdrop */}
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full container mx-auto max-w-7xl px-4 flex items-end pb-12">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Genres */}
          {movieGenres.length > 0 && (
            <div className="flex gap-2 mb-3">
              {movieGenres.map((genre) => (
                <span
                  key={genre}
                  className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
            {movie.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
            <RatingBadge rating={movie.vote_average} size="md" />
            {year && <span>{year}</span>}
          </div>

          {/* Overview */}
          <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-6">
            {movie.overview}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            {trailerKey && (
              <Button
                size="lg"
                onClick={() => setTrailerOpen(true)}
                className="gap-2"
              >
                <Play className="h-5 w-5 fill-current" />
                {t('watchTrailer')}
              </Button>
            )}
            <Button variant="secondary" size="lg" asChild className="gap-2">
              <Link href={`/movie/${movie.id}`}>
                <Info className="h-5 w-5" />
                {t('moreInfo')}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Trailer dialog */}
      {trailerKey && (
        <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
          <DialogContent className="max-w-3xl p-0 bg-black border-border overflow-hidden">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
