import type { DiscoverBaseFilters, DiscoverMovieFilters, DiscoverTVFilters } from '@/types/tmdb'
import type { FilterState } from '@/types/app'
import { CURRENT_YEAR, MIN_YEAR, VOTE_COUNT_MAX } from '@/lib/constants'

export function buildCommonFilters(state: FilterState): DiscoverBaseFilters {
  const filters: DiscoverBaseFilters = { sort_by: state.sortBy, page: state.page }
  if (state.genres.length) filters.with_genres = state.genres.join('|')
  if (state.countries.length) filters.with_origin_country = state.countries.join('|')
  if (state.ratingFrom > 0) filters['vote_average.gte'] = state.ratingFrom
  if (state.ratingTo < 10) filters['vote_average.lte'] = state.ratingTo
  if (state.voteCountMin > 0) filters['vote_count.gte'] = state.voteCountMin
  if (state.voteCountMax < VOTE_COUNT_MAX) filters['vote_count.lte'] = state.voteCountMax
  if (state.actors.length) filters.with_cast = state.actors.map((a) => a.id).join(',')
  return filters
}

export function buildMovieFilters(state: FilterState): DiscoverMovieFilters {
  const filters: DiscoverMovieFilters = { ...buildCommonFilters(state) }
  if (state.yearFrom !== MIN_YEAR) filters['primary_release_date.gte'] = `${state.yearFrom}-01-01`
  if (state.yearTo !== CURRENT_YEAR) filters['primary_release_date.lte'] = `${state.yearTo}-12-31`
  return filters
}

export function buildTVFilters(state: FilterState): DiscoverTVFilters {
  const filters: DiscoverTVFilters = { ...buildCommonFilters(state) }
  if (state.yearFrom !== MIN_YEAR) filters['first_air_date.gte'] = `${state.yearFrom}-01-01`
  if (state.yearTo !== CURRENT_YEAR) filters['first_air_date.lte'] = `${state.yearTo}-12-31`
  return filters
}
