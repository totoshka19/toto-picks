import { getLocale } from 'next-intl/server'
import { tmdbGenres } from '@/lib/tmdb'
import { CatalogContent } from '@/features/catalog/catalog-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TV Shows',
}

export default async function ShowsPage() {
  const locale = await getLocale()
  const { genres } = await tmdbGenres.shows(locale)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {locale === 'ru' ? 'Сериалы' : 'TV Shows'}
      </h1>
      <CatalogContent genres={genres} mediaType="tv" />
    </div>
  )
}
