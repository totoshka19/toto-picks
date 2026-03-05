import { getLocale } from 'next-intl/server'
import { tmdbMovies, tmdbShows, tmdbGenres } from '@/lib/tmdb'
import { HeroSection } from '@/features/home/hero-section'
import { SectionRow } from '@/features/home/section-row'
import type { Movie, TVShow, HeroItem, Genre } from '@/types/tmdb'

const toHeroMovie = (m: Movie, genres: Genre[]): HeroItem => ({
  id: m.id,
  title: m.title,
  overview: m.overview,
  poster_path: m.poster_path,
  backdrop_path: m.backdrop_path,
  vote_average: m.vote_average,
  vote_count: m.vote_count,
  genre_names: m.genre_ids.slice(0, 3)
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter((n): n is string => Boolean(n)),
  origin_country: m.origin_country,
  year: m.release_date ? new Date(m.release_date).getFullYear() : null,
  media_type: 'movie',
})

const toHeroShow = (s: TVShow, genres: Genre[]): HeroItem => ({
  id: s.id,
  title: s.name,
  overview: s.overview,
  poster_path: s.poster_path,
  backdrop_path: s.backdrop_path,
  vote_average: s.vote_average,
  vote_count: s.vote_count,
  genre_names: s.genre_ids.slice(0, 3)
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter((n): n is string => Boolean(n)),
  origin_country: s.origin_country,
  year: s.first_air_date ? new Date(s.first_air_date).getFullYear() : null,
  media_type: 'tv',
})

export default async function HomePage() {
  const locale = await getLocale()

  const [trending, nowPlaying, trendingShows, movieGenres, tvGenres] = await Promise.all([
    tmdbMovies.trending(locale),
    tmdbMovies.nowPlaying(1, locale),
    tmdbShows.trending(locale),
    tmdbGenres.movies(locale),
    tmdbGenres.shows(locale),
  ])

  const movies5 = trending.results.slice(0, 5).map((m) => toHeroMovie(m, movieGenres.genres))
  const shows5 = trendingShows.results.slice(0, 5).map((s) => toHeroShow(s, tvGenres.genres))
  const heroItems: HeroItem[] = movies5.flatMap((m, i) => shows5[i] ? [m, shows5[i]] : [m])

  return (
    <div className="space-y-12 pb-16">
      <HeroSection items={heroItems} />

      <div className="container mx-auto max-w-7xl px-4 space-y-12">
        <SectionRow
          titleKey="newReleases"
          items={nowPlaying.results.slice(0, 12)}
          mediaType="movie"
          viewAllHref="/movies"
          genres={movieGenres.genres}
        />

        <SectionRow
          titleKey="popularShows"
          items={trendingShows.results.slice(0, 12)}
          mediaType="tv"
          viewAllHref="/shows"
        />
      </div>
    </div>
  )
}
