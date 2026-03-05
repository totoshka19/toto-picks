import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { tmdbMovies, tmdbGenres, tmdbPoster, tmdbBackdrop } from '@/lib/tmdb'
import { RatingBadge } from '@/components/rating-badge'
import { HorizontalScroll } from '@/components/horizontal-scroll'
import { PersonCard } from '@/components/cards/person-card'
import { MovieCard } from '@/components/cards/movie-card'
import { FavoriteButton } from '@/features/detail/favorite-button'
import { TrailerButton } from '@/features/detail/trailer-button'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params
  try {
    const movie = await tmdbMovies.detail(Number(id), locale)
    return {
      title: movie.title,
      description: movie.overview?.slice(0, 160),
      openGraph: {
        images: tmdbPoster(movie.poster_path, 'lg') ? [tmdbPoster(movie.poster_path, 'lg')!] : [],
      },
    }
  } catch {
    return { title: 'Movie' }
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params
  const locale = await getLocale()
  const t = await getTranslations('movie')

  let movie
  let movieGenres
  try {
    ;[movie, movieGenres] = await Promise.all([
      tmdbMovies.detail(Number(id), locale),
      tmdbGenres.movies(locale),
    ])
  } catch {
    notFound()
  }

  const posterUrl = tmdbPoster(movie.poster_path, 'xl')
  const backdropUrl = tmdbBackdrop(movie.backdrop_path, 'lg')
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null
  const trailer = movie.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
  const director = movie.credits?.crew?.find((c) => c.job === 'Director')
  const cast = movie.credits?.cast?.slice(0, 15) ?? []

  const formatMoney = (amount: number) =>
    amount > 0 ? `$${(amount / 1_000_000).toFixed(0)}M` : '—'

  return (
    <div>
      {/* Backdrop hero */}
      <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
        {backdropUrl && (
          <Image src={backdropUrl} alt={movie.title} fill priority className="object-cover" sizes="100vw" />
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
                <Image src={posterUrl} alt={movie.title} fill className="object-cover" sizes="240px" />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              {movie.tagline && (
                <p className="text-sm text-primary italic mb-2">{movie.tagline}</p>
              )}
              <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <p className="text-muted-foreground text-sm mt-1">{movie.original_title}</p>
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <RatingBadge rating={movie.vote_average} size="lg" />
              <span className="text-muted-foreground/50">·</span>
              {year && <span>{year}</span>}
              {movie.runtime && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <span>{movie.runtime} {t('duration')}</span>
                </>
              )}
              {movie.genres?.slice(0, 3).map((g) => (
                <span key={g.id} className="px-2 py-0.5 rounded-full bg-card border border-border text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Production countries */}
            {movie.production_countries?.length > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground">{t('country')}:</span>{' '}
                {movie.production_countries.map((c) => c.name).join(', ')}
              </p>
            )}

            {/* Director */}
            {director && (
              <p className="text-sm">
                <span className="text-muted-foreground">{t('director')}:</span>{' '}
                <span className="font-medium">{director.name}</span>
              </p>
            )}

            {/* Overview */}
            {movie.overview && (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                {movie.overview}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {trailer && <TrailerButton trailerKey={trailer.key} label={t('watchTrailer')} />}
              <FavoriteButton
                item={{
                  id: movie.id,
                  mediaType: 'movie',
                  title: movie.title,
                  posterPath: movie.poster_path,
                  voteAverage: movie.vote_average,
                  voteCount: movie.vote_count,
                  releaseDate: movie.release_date,
                  genreIds: movie.genres?.map((g) => g.id) ?? [],
                  originCountry: movie.origin_country ?? [],
                }}
              />
            </div>
          </div>
        </div>

        {/* Details */}
        {(movie.budget > 0 || movie.revenue > 0) && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {movie.budget > 0 && (
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">{t('budget')}</p>
                <p className="font-semibold">{formatMoney(movie.budget)}</p>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">{t('revenue')}</p>
                <p className="font-semibold">{formatMoney(movie.revenue)}</p>
              </div>
            )}
            {movie.status && (
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">{t('status')}</p>
                <p className="font-semibold text-sm">{movie.status}</p>
              </div>
            )}
            {movie.production_companies?.[0] && (
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">{t('studio')}</p>
                <p className="font-semibold text-sm">{movie.production_companies[0].name}</p>
              </div>
            )}
          </div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-10 space-y-4">
            <h2 className="text-xl font-bold">{t('cast')}</h2>
            <HorizontalScroll>
              {cast.map((person) => (
                <PersonCard key={person.id} person={person} role={person.character} />
              ))}
            </HorizontalScroll>
          </div>
        )}

        {/* Similar */}
        {movie.similar?.results?.length > 0 && (
          <div className="mt-10 space-y-4 pb-16">
            <h2 className="text-xl font-bold">{t('similar')}</h2>
            <HorizontalScroll>
              {movie.similar.results.slice(0, 12).map((item) => (
                <div key={item.id} className="w-[160px] shrink-0">
                  <MovieCard item={item} mediaType="movie" genres={movieGenres.genres} />
                </div>
              ))}
            </HorizontalScroll>
          </div>
        )}
      </div>
    </div>
  )
}
