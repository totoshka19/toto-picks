import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { tmdbGenres } from '@/lib/tmdb'
import { WatchedContent } from '@/features/watched/watched-content'

export const metadata: Metadata = { title: 'Watched' }

export default async function WatchedPage() {
  const locale = await getLocale()
  const [movieGenres, tvGenres] = await Promise.all([
    tmdbGenres.movies(locale),
    tmdbGenres.shows(locale),
  ])

  return <WatchedContent movieGenres={movieGenres.genres} tvGenres={tvGenres.genres} />
}
