import type { Metadata } from 'next'
import { FavoritesContent } from '@/features/favorites/favorites-content'

export const metadata: Metadata = { title: 'Favorites' }

export default function FavoritesPage() {
  return <FavoritesContent />
}
