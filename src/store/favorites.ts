'use client'

import { FAVORITES_STORAGE_KEY } from '@/lib/constants'
import { createItemStore } from './create-item-store'

export const useFavoritesStore = createItemStore(FAVORITES_STORAGE_KEY)
