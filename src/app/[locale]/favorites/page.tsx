import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { tmdbGenres } from '@/lib/tmdb'
import { FavoritesContent } from '@/features/favorites/favorites-content'

export const metadata: Metadata = { title: 'Favorites' }

export default async function FavoritesPage() {
  const locale = await getLocale()
  const [movieGenres, tvGenres] = await Promise.all([
    tmdbGenres.movies(locale),
    tmdbGenres.shows(locale),
  ])

  return <FavoritesContent movieGenres={movieGenres.genres} tvGenres={tvGenres.genres} />
}
