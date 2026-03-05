'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { AnimatePresence, motion } from 'motion/react'
import { Info, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RatingBadge } from '@/components/rating-badge'
import { tmdbBackdrop } from '@/lib/tmdb'
import type { HeroItem } from '@/types/tmdb'
const DRAG_THRESHOLD = 50

type FlagModule = Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>
let flagModuleCache: FlagModule | null = null

const useFlagComponent = (code: string | undefined) => {
  const [Flag, setFlag] = useState<React.ComponentType<React.SVGProps<SVGSVGElement>> | null>(null)
  useEffect(() => {
    if (!code) { setFlag(null); return }
    const upper = code.toUpperCase()
    if (flagModuleCache) {
      setFlag(() => flagModuleCache![upper] ?? null)
      return
    }
    import('country-flag-icons/react/3x2')
      .then((mod) => {
        flagModuleCache = mod as unknown as FlagModule
        setFlag(() => flagModuleCache![upper] ?? null)
      })
      .catch(() => setFlag(null))
  }, [code])
  return Flag
}

const getCountryName = (code: string, locale: string) => {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

const formatVotes = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

interface HeroSectionProps {
  items: HeroItem[]
}

export const HeroSection = ({ items }: HeroSectionProps) => {
  const t = useTranslations('movie')
  const locale = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const dragStartX = useRef<number | null>(null)
  const didDrag = useRef(false)

  const item = items[currentIndex]
  const Flag = useFlagComponent(item.origin_country?.[0])

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % items.length)
  }, [items.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + items.length) % items.length)
  }, [items.length])

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

  const backdropUrl = tmdbBackdrop(item.backdrop_path, 'lg')
  const href = item.media_type === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`

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
          key={item.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={item.title}
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
            key={item.id}
            className="max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {item.genre_names.length > 0 && (
              <div className="flex gap-2 mb-3">
                {item.genre_names.map((genre) => (
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
              {item.title}
            </h1>

            <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground flex-wrap">
              <RatingBadge rating={item.vote_average} size="md" />
              {item.vote_count > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {formatVotes(item.vote_count)} {t('votes')}
                </span>
              )}
              {item.origin_country?.[0] && (
                <span className="flex items-center gap-1.5">
                  {Flag && <Flag className="h-3.5 w-auto rounded-[1px]" />}
                  {getCountryName(item.origin_country![0], locale)}
                </span>
              )}
              {item.year && <span>{item.year}</span>}
            </div>

            <p className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-6">
              {item.overview}
            </p>

            <Button
              variant="secondary"
              size="lg"
              asChild
              className="gap-2"
              onClick={(e) => { if (didDrag.current) e.preventDefault() }}
            >
              <Link href={href}>
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
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className="min-h-[44px] px-1.5 flex items-center justify-center"
          >
            <span className={`rounded-full transition-all duration-300 block ${
              i === currentIndex
                ? 'w-6 h-1.5 bg-primary'
                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`} />
          </button>
        ))}
      </div>
    </section>
  )
}
