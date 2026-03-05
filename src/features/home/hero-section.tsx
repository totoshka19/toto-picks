'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'motion/react'
import { Info, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RatingBadge } from '@/components/rating-badge'
import { tmdbBackdrop } from '@/lib/tmdb'
import type { Movie } from '@/types/tmdb'

const DRAG_THRESHOLD = 50

const countryFlag = (code: string) =>
  [...code.toUpperCase()].map((c) => String.fromCodePoint(0x1F1E6 - 65 + c.codePointAt(0)!)).join('')

const formatVotes = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

interface HeroSectionProps {
  movies: Movie[]
  genres?: { id: number; name: string }[]
}

export const HeroSection = ({ movies, genres }: HeroSectionProps) => {
  const t = useTranslations('movie')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const dragStartX = useRef<number | null>(null)
  const didDrag = useRef(false)

  const movie = movies[currentIndex]

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % movies.length)
  }, [movies.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + movies.length) % movies.length)
  }, [movies.length])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(goNext, 6000)
    return () => clearInterval(timer)
  }, [isPaused, goNext])

  const handleDragStart = (clientX: number) => {
    dragStartX.current = clientX
    didDrag.current = false
  }

  const handleDragEnd = (clientX: number) => {
    if (dragStartX.current === null) return
    const delta = clientX - dragStartX.current
    if (Math.abs(delta) > DRAG_THRESHOLD) {
      didDrag.current = true
      delta > 0 ? goPrev() : goNext()
    }
    dragStartX.current = null
  }

  const backdropUrl = tmdbBackdrop(movie.backdrop_path, 'lg')
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null
  const movieGenres = genres
    ? movie.genre_ids?.slice(0, 3).map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean)
    : []

  return (
    <section
      className="relative h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); dragStartX.current = null }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseUp={(e) => handleDragEnd(e.clientX)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
    >
      {/* Backdrop crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={movie.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
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
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 h-full container mx-auto max-w-7xl px-4 flex items-end pb-16">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={movie.id}
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
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

            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
              {movie.title}
            </h1>

            <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground flex-wrap">
              <RatingBadge rating={movie.vote_average} size="md" />
              {movie.vote_count > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {formatVotes(movie.vote_count)} {t('votes')}
                </span>
              )}
              {year && <span>{year}</span>}
              {movie.origin_country?.[0] && (
                <span>{countryFlag(movie.origin_country[0])}</span>
              )}
            </div>

            <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-6">
              {movie.overview}
            </p>

            <Button
              variant="secondary"
              size="lg"
              asChild
              className="gap-2"
              onClick={(e) => { if (didDrag.current) e.preventDefault() }}
            >
              <Link href={`/movie/${movie.id}`}>
                <Info className="h-5 w-5" />
                {t('moreInfo')}
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next arrows — visible only on wide screens */}
      <button
        onClick={goPrev}
        aria-label="Previous"
        className="hidden min-[1440px]:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goNext}
        aria-label="Next"
        className="hidden min-[1440px]:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-6 h-1.5 bg-primary'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
