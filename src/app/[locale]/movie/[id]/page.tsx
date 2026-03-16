import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { tmdbMovies, tmdbGenres, tmdbPoster, tmdbBackdrop } from '@/lib/tmdb'
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

const formatMoney = (amount: number) =>
  amount > 0 ? `$${(amount / 1_000_000).toFixed(0)}M` : '—'

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

  return (
    <MediaDetailLayout
      backdropUrl={backdropUrl}
      posterUrl={posterUrl}
      title={movie.title}
      originalTitle={movie.original_title}
      tagline={movie.tagline}
      year={year}
      rating={movie.vote_average}
      genres={movie.genres ?? []}
      metaExtra={movie.runtime ? (
        <>
          <span className="text-muted-foreground/50">·</span>
          <span>{movie.runtime} {t('duration')}</span>
        </>
      ) : undefined}
      infoRows={
        <>
          {movie.production_countries?.length > 0 && (
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">{t('country')}:</span>{' '}
              {movie.production_countries.map((c) => c.name).join(', ')}
            </p>
          )}
          {director && (
            <p className="text-sm">
              <span className="text-muted-foreground">{t('director')}:</span>{' '}
              <span className="font-medium">{director.name}</span>
            </p>
          )}
        </>
      }
      overview={movie.overview}
      actionButtons={
        <>
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
        </>
      }
      detailsSection={(movie.budget > 0 || movie.revenue > 0) ? (
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
      ) : undefined}
      cast={cast}
      castLabel={t('cast')}
      similar={movie.similar?.results ?? []}
      similarLabel={t('similar')}
      mediaType="movie"
      genresList={movieGenres.genres}
    />
  )
}
