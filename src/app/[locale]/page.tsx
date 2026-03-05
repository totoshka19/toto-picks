import { getLocale } from 'next-intl/server'
import { tmdbMovies, tmdbShows, tmdbGenres } from '@/lib/tmdb'
import { HeroSection } from '@/features/home/hero-section'
import { SectionRow } from '@/features/home/section-row'

export default async function HomePage() {
  const locale = await getLocale()

  const [trending, nowPlaying, popularShows, genresData] = await Promise.all([
    tmdbMovies.trending(locale),
    tmdbMovies.nowPlaying(1, locale),
    tmdbShows.trending(locale),
    tmdbGenres.movies(locale),
  ])

  const heroMovies = trending.results.slice(0, 10)
  const genres = genresData.genres

  return (
    <div className="space-y-12 pb-16">
      <HeroSection movies={heroMovies} genres={genres} />

      <div className="container mx-auto max-w-7xl px-4 space-y-12">
        <SectionRow
          titleKey="newReleases"
          items={nowPlaying.results.slice(0, 12)}
          mediaType="movie"
          viewAllHref="/movies"
          genres={genres}
        />

        <SectionRow
          titleKey="popularShows"
          items={popularShows.results.slice(0, 12)}
          mediaType="tv"
          viewAllHref="/shows"
        />
      </div>
    </div>
  )
}
