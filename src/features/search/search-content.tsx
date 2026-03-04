'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { tmdbSearch } from '@/lib/tmdb'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MovieCard, MovieCardSkeleton } from '@/components/cards/movie-card'
import { PersonCard } from '@/components/cards/person-card'
import { EmptyState } from '@/components/empty-state'
import { Pagination } from '@/components/pagination'
import { Search } from 'lucide-react'
import type { Movie, TVShow, Person, MultiSearchResult } from '@/types/tmdb'

const isMovie = (r: MultiSearchResult): r is Movie & { media_type: 'movie' } => r.media_type === 'movie'
const isTV = (r: MultiSearchResult): r is TVShow & { media_type: 'tv' } => r.media_type === 'tv'
const isPerson = (r: MultiSearchResult): r is Person & { media_type: 'person' } => r.media_type === 'person'

export const SearchContent = () => {
  const t = useTranslations('search')
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedQuery(query); setPage(1) }, 400)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, page, locale],
    queryFn: () => tmdbSearch.multi(debouncedQuery, page, locale),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
  })

  const movies = data?.results.filter(isMovie) ?? []
  const shows = data?.results.filter(isTV) ?? []
  const people = data?.results.filter(isPerson) ?? []

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 space-y-6">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          className="pl-12 h-12 text-base"
          autoFocus
        />
      </div>

      {/* Results */}
      {debouncedQuery.length >= 2 && (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">{t('all')} {data ? `(${data.total_results})` : ''}</TabsTrigger>
            <TabsTrigger value="movies">{t('movies')} {movies.length > 0 ? `(${movies.length})` : ''}</TabsTrigger>
            <TabsTrigger value="shows">{t('shows')} {shows.length > 0 ? `(${shows.length})` : ''}</TabsTrigger>
            <TabsTrigger value="people">{t('people')} {people.length > 0 ? `(${people.length})` : ''}</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => <MovieCardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-4">
                {data?.results.length === 0 ? (
                  <EmptyState title={t('noResults')} description={t('noResultsDesc')} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {data?.results.map((r) => {
                      if (isMovie(r)) return <MovieCard key={`m-${r.id}`} item={r} mediaType="movie" />
                      if (isTV(r)) return <MovieCard key={`t-${r.id}`} item={r} mediaType="tv" />
                      if (isPerson(r)) return (
                        <div key={`p-${r.id}`} className="col-span-1">
                          <PersonCard person={r} />
                        </div>
                      )
                      return null
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="movies" className="mt-4">
                {movies.length === 0 ? (
                  <EmptyState title={t('noResults')} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {movies.map((r) => <MovieCard key={r.id} item={r} mediaType="movie" />)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="shows" className="mt-4">
                {shows.length === 0 ? (
                  <EmptyState title={t('noResults')} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {shows.map((r) => <MovieCard key={r.id} item={r} mediaType="tv" />)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="people" className="mt-4">
                {people.length === 0 ? (
                  <EmptyState title={t('noResults')} />
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {people.map((r) => <PersonCard key={r.id} person={r} />)}
                  </div>
                )}
              </TabsContent>
            </>
          )}

          {data && data.total_pages > 1 && (
            <Pagination
              page={page}
              totalPages={data.total_pages}
              onPageChange={setPage}
              className="mt-8"
            />
          )}
        </Tabs>
      )}

      {debouncedQuery.length < 2 && query.length === 0 && (
        <p className="text-center text-muted-foreground py-20">{t('placeholder')}</p>
      )}
    </div>
  )
}
