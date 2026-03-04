'use client'

import { create } from 'zustand'
import { DEFAULT_FILTERS, CURRENT_YEAR, MIN_YEAR } from '@/lib/constants'
import type { FilterState, PersonFilter } from '@/types/app'

interface FiltersStore extends FilterState {
  setGenres: (genres: number[]) => void
  toggleGenre: (id: number) => void
  setCountries: (countries: string[]) => void
  toggleCountry: (code: string) => void
  setYearFrom: (year: number) => void
  setYearTo: (year: number) => void
  setRatingFrom: (rating: number) => void
  setRatingTo: (rating: number) => void
  setVoteCountMin: (count: number) => void
  setActors: (actors: PersonFilter[]) => void
  addActor: (actor: PersonFilter) => void
  removeActor: (id: number) => void
  setDirector: (director: PersonFilter | null) => void
  setSortBy: (sortBy: string) => void
  setPage: (page: number) => void
  resetFilters: () => void
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  ...DEFAULT_FILTERS,

  setGenres: (genres) => set({ genres, page: 1 }),
  toggleGenre: (id) =>
    set((state) => ({
      genres: state.genres.includes(id)
        ? state.genres.filter((g) => g !== id)
        : [...state.genres, id],
      page: 1,
    })),

  setCountries: (countries) => set({ countries, page: 1 }),
  toggleCountry: (code) =>
    set((state) => ({
      countries: state.countries.includes(code)
        ? state.countries.filter((c) => c !== code)
        : [...state.countries, code],
      page: 1,
    })),

  setYearFrom: (yearFrom) => set({ yearFrom, page: 1 }),
  setYearTo: (yearTo) => set({ yearTo, page: 1 }),

  setRatingFrom: (ratingFrom) => set({ ratingFrom, page: 1 }),
  setRatingTo: (ratingTo) => set({ ratingTo, page: 1 }),

  setVoteCountMin: (voteCountMin) => set({ voteCountMin, page: 1 }),

  setActors: (actors) => set({ actors, page: 1 }),
  addActor: (actor) =>
    set((state) => ({
      actors: state.actors.find((a) => a.id === actor.id)
        ? state.actors
        : [...state.actors, actor],
      page: 1,
    })),
  removeActor: (id) =>
    set((state) => ({
      actors: state.actors.filter((a) => a.id !== id),
      page: 1,
    })),

  setDirector: (director) => set({ director, page: 1 }),

  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setPage: (page) => set({ page }),

  resetFilters: () =>
    set({
      ...DEFAULT_FILTERS,
      yearFrom: MIN_YEAR,
      yearTo: CURRENT_YEAR,
    }),
}))
