'use client'

import { WATCHED_STORAGE_KEY } from '@/lib/constants'
import { createItemStore } from './create-item-store'

export const useWatchedStore = createItemStore(WATCHED_STORAGE_KEY)
