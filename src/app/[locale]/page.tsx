import { getLocale } from 'next-intl/server'
import { tmdbMovies, tmdbShows, tmdbGenres } from '@/lib/tmdb'
import { HeroSection } from '@/features/home/hero-section'
import { SectionRow } from '@/features/home/section-row'
import { GenreChips } from '@/features/home/genre-chips'

export default async function HomePage() {
  const locale = await getLocale()

  const [trending, nowPlaying, popularShows, genresData] = await Promise.all([
    tmdbMovies.trending(locale),
    tmdbMovies.nowPlaying(1, locale),
    tmdbShows.trending(locale),
    tmdbGenres.movies(locale),
  ])

  const heroMovie = trending.results[0]
  const genres = genresData.genres

  return (
    <div className="space-y-12 pb-16">
      {heroMovie && (
        <HeroSection
          movie={heroMovie}
          genres={genres}
        />
      )}

      <div className="container mx-auto max-w-7xl px-4 space-y-12">
        <SectionRow
          titleKey="trending"
          items={trending.results.slice(1, 13)}
          mediaType="movie"
          viewAllHref="/movies"
          genres={genres}
        />

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

        <GenreChips genres={genres} />
      </div>
    </div>
  )
}
