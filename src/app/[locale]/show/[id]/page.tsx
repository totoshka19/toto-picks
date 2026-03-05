import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { tmdbShows, tmdbGenres, tmdbPoster, tmdbBackdrop, tmdbImage } from '@/lib/tmdb'
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
    const show = await tmdbShows.detail(Number(id), locale)
    return {
      title: show.name,
      description: show.overview?.slice(0, 160),
      openGraph: {
        images: tmdbPoster(show.poster_path, 'lg') ? [tmdbPoster(show.poster_path, 'lg')!] : [],
      },
    }
  } catch {
    return { title: 'TV Show' }
  }
}

export default async function ShowPage({ params }: Props) {
  const { id } = await params
  const locale = await getLocale()
  const t = await getTranslations('show')
  const tMovie = await getTranslations('movie')

  let show
  let tvGenres
  try {
    ;[show, tvGenres] = await Promise.all([
      tmdbShows.detail(Number(id), locale),
      tmdbGenres.shows(locale),
    ])
  } catch {
    notFound()
  }

  const posterUrl = tmdbPoster(show.poster_path, 'xl')
  const backdropUrl = tmdbBackdrop(show.backdrop_path, 'lg')
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null
  const trailer = show.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
  const cast = show.credits?.cast?.slice(0, 15) ?? []
  const seasons = show.seasons?.filter((s) => s.season_number > 0) ?? []

  return (
    <div>
      {/* Backdrop hero */}
      <div className="relative h-[50vh] min-h-[350px] overflow-hidden">
        {backdropUrl && (
          <Image src={backdropUrl} alt={show.name} fill priority className="object-cover" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {posterUrl && (
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="relative w-[200px] md:w-[240px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image src={posterUrl} alt={show.name} fill className="object-cover" sizes="240px" />
              </div>
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div>
              {show.tagline && <p className="text-sm text-primary italic mb-2">{show.tagline}</p>}
              <h1 className="text-3xl md:text-4xl font-bold">{show.name}</h1>
              {show.original_name !== show.name && (
                <p className="text-muted-foreground text-sm mt-1">{show.original_name}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <RatingBadge rating={show.vote_average} size="lg" />
              <span className="text-muted-foreground/50">·</span>
              {year && <span>{year}</span>}
              <span className="text-muted-foreground/50">·</span>
              <span>{show.number_of_seasons} {t('seasons')}</span>
              {show.genres?.slice(0, 3).map((g) => (
                <span key={g.id} className="px-2 py-0.5 rounded-full bg-card border border-border text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              {show.status && (
                <p>
                  <span className="text-muted-foreground">{t('status')}:</span>{' '}
                  <span className={show.in_production ? 'text-green-400' : 'text-muted-foreground'}>
                    {show.in_production ? t('ongoing') : t('ended')}
                  </span>
                </p>
              )}
              {show.origin_country?.length > 0 && (
                <p>
                  <span className="text-muted-foreground">{tMovie('country')}:</span>{' '}
                  {show.origin_country.join(', ')}
                </p>
              )}
            </div>

            {show.overview && (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                {show.overview}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {trailer && <TrailerButton trailerKey={trailer.key} label={tMovie('watchTrailer')} />}
              <FavoriteButton
                item={{
                  id: show.id,
                  mediaType: 'tv',
                  title: show.name,
                  posterPath: show.poster_path,
                  voteAverage: show.vote_average,
                  releaseDate: show.first_air_date,
                  genreIds: show.genres?.map((g) => g.id) ?? [],
                }}
              />
            </div>
          </div>
        </div>

        {/* Seasons */}
        {seasons.length > 0 && (
          <div className="mt-10 space-y-3">
            <h2 className="text-xl font-bold">{t('seasons')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {seasons.map((season) => {
                const seasonPoster = tmdbImage(season.poster_path, 'w200')
                return (
                  <div key={season.id} className="rounded-lg overflow-hidden bg-card border border-border">
                    <div className="relative aspect-[2/3] bg-muted">
                      {seasonPoster ? (
                        <Image src={seasonPoster} alt={season.name} fill sizes="160px" className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-xs p-2 text-center">
                          {t('season')} {season.season_number}
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium leading-tight">{season.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {season.episode_count} {t('episodes')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
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
        {show.similar?.results?.length > 0 && (
          <div className="mt-10 space-y-4 pb-16">
            <h2 className="text-xl font-bold">{t('similar')}</h2>
            <HorizontalScroll>
              {show.similar.results.slice(0, 12).map((item) => (
                <div key={item.id} className="w-[160px] shrink-0">
                  <MovieCard item={item} mediaType="tv" genres={tvGenres.genres} />
                </div>
              ))}
            </HorizontalScroll>
          </div>
        )}
      </div>
    </div>
  )
}
