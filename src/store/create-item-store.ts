'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FavoriteItem } from '@/types/app'

interface ItemStore {
  items: FavoriteItem[]
  add: (item: FavoriteItem) => void
  remove: (id: number, mediaType: FavoriteItem['mediaType']) => void
  has: (id: number, mediaType: FavoriteItem['mediaType']) => boolean
}

/** Factory that creates a persisted Zustand store for a list of FavoriteItems.
 *  Used by both favorites and watched stores — same logic, different localStorage keys. */
export const createItemStore = (storageKey: string) =>
  create<ItemStore>()(
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
      { name: storageKey }
    )
  )
