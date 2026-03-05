import type { Metadata } from 'next'
import { WatchedContent } from '@/features/watched/watched-content'

export const metadata: Metadata = { title: 'Watched' }

export default function WatchedPage() {
  return <WatchedContent />
}
