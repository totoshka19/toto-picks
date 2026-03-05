'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WATCHED_STORAGE_KEY } from '@/lib/constants'
import type { FavoriteItem } from '@/types/app'

interface WatchedStore {
  items: FavoriteItem[]
  add: (item: FavoriteItem) => void
  remove: (id: number, mediaType: FavoriteItem['mediaType']) => void
  has: (id: number, mediaType: FavoriteItem['mediaType']) => boolean
}

export const useWatchedStore = create<WatchedStore>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) => ({
          items: state.items.find((i) => i.id === item.id && i.mediaType === item.mediaType)
            ? state.items
            : [...state.items, item],
        })),

      remove: (id, mediaType) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.mediaType === mediaType)),
        })),

      has: (id, mediaType) =>
        get().items.some((i) => i.id === id && i.mediaType === mediaType),
    }),
    {
      name: WATCHED_STORAGE_KEY,
    }
  )
)
