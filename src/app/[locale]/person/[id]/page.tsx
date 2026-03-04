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
  // Combine crew (director/key roles first) + cast, deduplicated by movie id
  const seenMovies = new Set<number>()
  const movieCredits = [
    ...(person.movie_credits?.crew?.filter((c) => c.job === 'Director') ?? []),
    ...(person.movie_credits?.cast ?? []),
    ...(person.movie_credits?.crew?.filter((c) => c.job !== 'Director') ?? []),
  ]
    .filter((m) => {
      if (!m.poster_path || seenMovies.has(m.id)) return false
      seenMovies.add(m.id)
      return true
    })
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))

  const seenShows = new Set<number>()
  const tvCredits = [
    ...(person.tv_credits?.crew?.filter((c) => c.job === 'Director' || c.job === 'Series Director') ?? []),
    ...(person.tv_credits?.cast ?? []),
    ...(person.tv_credits?.crew?.filter((c) => c.job !== 'Director' && c.job !== 'Series Director') ?? []),
  ]
    .filter((s) => {
      if (!s.poster_path || seenShows.has(s.id)) return false
      seenShows.add(s.id)
      return true
    })
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))

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
      {(movieCredits.length > 0 || tvCredits.length > 0) && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">{t('filmography')}</h2>
          <Tabs defaultValue="movies">
            <TabsList className="mb-4">
              {movieCredits.length > 0 && (
                <TabsTrigger value="movies">{t('movies')} ({movieCredits.length})</TabsTrigger>
              )}
              {tvCredits.length > 0 && (
                <TabsTrigger value="shows">{t('shows')} ({tvCredits.length})</TabsTrigger>
              )}
            </TabsList>

            {movieCredits.length > 0 && (
              <TabsContent value="movies">
                <HorizontalScroll>
                  {movieCredits.map((item) => (
                    <div key={item.id} className="w-[160px] shrink-0">
                      <MovieCard item={item} mediaType="movie" />
                    </div>
                  ))}
                </HorizontalScroll>
              </TabsContent>
            )}

            {tvCredits.length > 0 && (
              <TabsContent value="shows">
                <HorizontalScroll>
                  {tvCredits.map((item) => (
                    <div key={item.id} className="w-[160px] shrink-0">
                      <MovieCard item={item} mediaType="tv" />
                    </div>
                  ))}
                </HorizontalScroll>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  )
}
