import { getLocale } from 'next-intl/server'
import { tmdbGenres, tmdbCountries } from '@/lib/tmdb'
import { CatalogContent } from '@/features/catalog/catalog-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Movies',
}

export default async function MoviesPage() {
  const locale = await getLocale()
  const [{ genres }, countries] = await Promise.all([
    tmdbGenres.movies(locale),
    tmdbCountries.list(),
  ])

  return (
    <div className="container mx-auto max-w-7xl px-4 min-[576px]:px-8 py-8">
      <CatalogContent genres={genres} countries={countries} mediaType="movie" />
    </div>
  )
}
