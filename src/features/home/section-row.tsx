import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ChevronRight } from 'lucide-react'
import { HorizontalScroll } from '@/components/horizontal-scroll'
import { MovieCard, MovieCardSkeleton } from '@/components/cards/movie-card'
import type { Movie, TVShow } from '@/types/tmdb'
import type { MediaType } from '@/types/app'

interface SectionRowProps {
  titleKey: string
  items: (Movie | TVShow)[]
  mediaType: MediaType
  viewAllHref?: string
  genres?: { id: number; name: string }[]
  isLoading?: boolean
}

export const SectionRow = ({
  titleKey,
  items,
  mediaType,
  viewAllHref,
  genres,
  isLoading,
}: SectionRowProps) => {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t(titleKey as Parameters<typeof t>[0])}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {tCommon('viewAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <HorizontalScroll>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-[160px] shrink-0">
                <MovieCardSkeleton />
              </div>
            ))
          : items.map((item) => (
              <div key={item.id} className="w-[160px] shrink-0">
                <MovieCard item={item} mediaType={mediaType} genres={genres} />
              </div>
            ))}
      </HorizontalScroll>
    </section>
  )
}
