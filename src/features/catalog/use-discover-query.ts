'use client'

import { useFiltersStore } from '@/store/filters'
import { useDirectorFilmographyQuery } from './use-director-filmography-query'
import { useStandardDiscoverQuery } from './use-standard-discover-query'
import type { TMDBResponse, Movie, TVShow } from '@/types/tmdb'
import type { MediaType } from '@/types/app'

export type DiscoverResult = TMDBResponse<Movie | TVShow>

/**
 * Orchestrates discover queries: delegates to useDirectorFilmographyQuery
 * when a director filter is active, otherwise uses useStandardDiscoverQuery.
 * Both hooks are always called (Rules of Hooks); the inactive one is disabled via `enabled`.
 */
export const useDiscoverQuery = (mediaType: MediaType) => {
  const store = useFiltersStore()
  const isDirectorMode = mediaType === 'movie' && !!store.director

  const directorQuery = useDirectorFilmographyQuery(mediaType)
  const standardQuery = useStandardDiscoverQuery(mediaType, !isDirectorMode)

  return isDirectorMode ? directorQuery : standardQuery
}
