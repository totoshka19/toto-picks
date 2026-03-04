import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { tmdbPerson, tmdbProfile } from '@/lib/tmdb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HorizontalScroll } from '@/components/horizontal-scroll'
import { MovieCard } from '@/components/cards/movie-card'
import { Calendar, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const person = await tmdbPerson.detail(Number(id))
    return { title: person.name }
  } catch {
    return { title: 'Person' }
  }
}

export default async function PersonPage({ params }: Props) {
  const { id } = await params
  const locale = await getLocale()
  const t = await getTranslations('person')

  let person
  try {
    person = await tmdbPerson.detail(Number(id), locale)
  } catch {
    notFound()
  }

  const profileUrl = tmdbProfile(person.profile_path, 'lg')

  // ── Movies: separate cast and crew ────────────────────────────────────────
  const castMovies = (person.movie_credits?.cast ?? [])
    .filter((m) => m.poster_path)
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))

  const seenCrewMovies = new Set<number>()
  const crewMovies = (person.movie_credits?.crew ?? [])
    .filter((m) => {
      if (!m.poster_path || seenCrewMovies.has(m.id)) return false
      seenCrewMovies.add(m.id)
      return true
    })
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))

  const totalMovies = new Set([
    ...castMovies.map((m) => m.id),
    ...crewMovies.map((m) => m.id),
  ]).size

  // ── TV Shows: separate cast and crew ──────────────────────────────────────
  const castShows = (person.tv_credits?.cast ?? [])
    .filter((s) => s.poster_path)
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))

  const seenCrewShows = new Set<number>()
  const crewShows = (person.tv_credits?.crew ?? [])
    .filter((s) => {
      if (!s.poster_path || seenCrewShows.has(s.id)) return false
      seenCrewShows.add(s.id)
      return true
    })
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))

  const totalShows = new Set([
    ...castShows.map((s) => s.id),
    ...crewShows.map((s) => s.id),
  ]).size

  const hasMovies = totalMovies > 0
  const hasShows = totalShows > 0

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Photo */}
        <div className="shrink-0 mx-auto md:mx-0">
          <div className="relative w-[200px] aspect-[2/3] rounded-xl overflow-hidden bg-muted shadow-xl">
            {profileUrl ? (
              <Image src={profileUrl} alt={person.name} fill className="object-cover" sizes="200px" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground">
                {person.name[0]}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{person.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">{person.known_for_department}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {person.birthday && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {person.birthday}
              </span>
            )}
            {person.place_of_birth && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {person.place_of_birth}
              </span>
            )}
          </div>

          {person.biography && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {t('biography')}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line line-clamp-6">
                {person.biography}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filmography */}
      {(hasMovies || hasShows) && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">{t('filmography')}</h2>
          <Tabs defaultValue={hasMovies ? 'movies' : 'shows'}>
            <TabsList className="mb-6">
              {hasMovies && (
                <TabsTrigger value="movies">{t('movies')} ({totalMovies})</TabsTrigger>
              )}
              {hasShows && (
                <TabsTrigger value="shows">{t('shows')} ({totalShows})</TabsTrigger>
              )}
            </TabsList>

            {/* Movies tab */}
            {hasMovies && (
              <TabsContent value="movies" className="space-y-8">
                {castMovies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      {t('asActor')}
                    </h3>
                    <HorizontalScroll>
                      {castMovies.map((item) => (
                        <div key={item.id} className="w-[160px] shrink-0">
                          <MovieCard item={item} mediaType="movie" />
                        </div>
                      ))}
                    </HorizontalScroll>
                  </div>
                )}
                {crewMovies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      {t('asCrew')}
                    </h3>
                    <HorizontalScroll>
                      {crewMovies.map((item) => (
                        <div key={item.id} className="w-[160px] shrink-0">
                          <MovieCard item={item} mediaType="movie" />
                        </div>
                      ))}
                    </HorizontalScroll>
                  </div>
                )}
              </TabsContent>
            )}

            {/* TV Shows tab */}
            {hasShows && (
              <TabsContent value="shows" className="space-y-8">
                {castShows.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      {t('asActor')}
                    </h3>
                    <HorizontalScroll>
                      {castShows.map((item) => (
                        <div key={item.id} className="w-[160px] shrink-0">
                          <MovieCard item={item} mediaType="tv" />
                        </div>
                      ))}
                    </HorizontalScroll>
                  </div>
                )}
                {crewShows.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      {t('asCrew')}
                    </h3>
                    <HorizontalScroll>
                      {crewShows.map((item) => (
                        <div key={item.id} className="w-[160px] shrink-0">
                          <MovieCard item={item} mediaType="tv" />
                        </div>
                      ))}
                    </HorizontalScroll>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  )
}
