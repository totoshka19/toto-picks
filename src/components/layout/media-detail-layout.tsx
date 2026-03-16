import type { ReactNode } from 'react'
import Image from 'next/image'
import { RatingBadge } from '@/components/rating-badge'
import { HorizontalScroll } from '@/components/horizontal-scroll'
import { PersonCard } from '@/components/cards/person-card'
import { MovieCard } from '@/components/cards/movie-card'
import type { Cast, Movie, TVShow, Genre } from '@/types/tmdb'
import type { MediaType } from '@/types/app'

interface MediaDetailLayoutProps {
  backdropUrl: string | null
  posterUrl: string | null
  title: string
  originalTitle?: string | null
  tagline?: string | null
  year: number | null
  rating: number
  genres: Genre[]
  /** Type-specific meta (runtime for movies, season count for shows) */
  metaExtra?: ReactNode
  /** Type-specific info rows (director/countries for movies, status/country for shows) */
  infoRows?: ReactNode
  overview?: string | null
  actionButtons: ReactNode
  /** Type-specific details block (budget grid for movies, seasons grid for shows) */
  detailsSection?: ReactNode
  cast: Cast[]
  castLabel: string
  similar: (Movie | TVShow)[]
  similarLabel: string
  mediaType: MediaType
  genresList: Genre[]
}

export const MediaDetailLayout = ({
  backdropUrl,
  posterUrl,
  title,
  originalTitle,
  tagline,
  year,
  rating,
  genres,
  metaExtra,
  infoRows,
  overview,
  actionButtons,
  detailsSection,
  cast,
  castLabel,
  similar,
  similarLabel,
  mediaType,
  genresList,
}: MediaDetailLayoutProps) => (
  <div>
    {/* Backdrop hero */}
    <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
      {backdropUrl && (
        <Image src={backdropUrl} alt={title} fill priority className="object-cover" sizes="100vw" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
    </div>

    {/* Main content */}
    <div className="container mx-auto max-w-7xl px-4 min-[576px]:px-8 -mt-40 relative z-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        {posterUrl && (
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative w-[200px] md:w-[240px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
              <Image src={posterUrl} alt={title} fill className="object-cover" sizes="240px" />
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            {tagline && <p className="text-sm text-primary italic mb-2">{tagline}</p>}
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            {originalTitle && originalTitle !== title && (
              <p className="text-muted-foreground text-sm mt-1">{originalTitle}</p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <RatingBadge rating={rating} size="lg" />
            <span className="text-muted-foreground/50">·</span>
            {year && <span>{year}</span>}
            {metaExtra}
            {genres.slice(0, 3).map((g) => (
              <span key={g.id} className="px-2 py-0.5 rounded-full bg-card border border-border text-xs">
                {g.name}
              </span>
            ))}
          </div>

          {infoRows}

          {overview && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {overview}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {actionButtons}
          </div>
        </div>
      </div>

      {detailsSection}

      {/* Cast */}
      {cast.length > 0 && (
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-bold">{castLabel}</h2>
          <HorizontalScroll>
            {cast.map((person) => (
              <PersonCard key={person.id} person={person} role={person.character} />
            ))}
          </HorizontalScroll>
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <div className="mt-10 space-y-4 pb-16">
          <h2 className="text-xl font-bold">{similarLabel}</h2>
          <HorizontalScroll>
            {similar.slice(0, 12).map((item) => (
              <div key={item.id} className="w-[160px] shrink-0">
                <MovieCard item={item} mediaType={mediaType} genres={genresList} />
              </div>
            ))}
          </HorizontalScroll>
        </div>
      )}
    </div>
  </div>
)
