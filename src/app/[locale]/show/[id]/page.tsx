import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { tmdbShows, tmdbGenres, tmdbPoster, tmdbBackdrop, tmdbImage } from '@/lib/tmdb'
import { MediaDetailLayout } from '@/components/layout/media-detail-layout'
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
    <MediaDetailLayout
      backdropUrl={backdropUrl}
      posterUrl={posterUrl}
      title={show.name}
      originalTitle={show.original_name}
      tagline={show.tagline}
      year={year}
      rating={show.vote_average}
      genres={show.genres ?? []}
      metaExtra={
        <>
          <span className="text-muted-foreground/50">·</span>
          <span>{show.number_of_seasons} {t('seasons')}</span>
        </>
      }
      infoRows={
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
      }
      overview={show.overview}
      actionButtons={
        <>
          {trailer && <TrailerButton trailerKey={trailer.key} label={tMovie('watchTrailer')} />}
          <FavoriteButton
            item={{
              id: show.id,
              mediaType: 'tv',
              title: show.name,
              posterPath: show.poster_path,
              voteAverage: show.vote_average,
              voteCount: show.vote_count,
              releaseDate: show.first_air_date,
              genreIds: show.genres?.map((g) => g.id) ?? [],
              originCountry: show.origin_country ?? [],
            }}
          />
        </>
      }
      detailsSection={seasons.length > 0 ? (
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
      ) : undefined}
      cast={cast}
      castLabel={t('cast')}
      similar={show.similar?.results ?? []}
      similarLabel={t('similar')}
      mediaType="tv"
      genresList={tvGenres.genres}
    />
  )
}
