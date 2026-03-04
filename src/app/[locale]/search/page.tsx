import type { Metadata } from 'next'
import { SearchContent } from '@/features/search/search-content'

export const metadata: Metadata = { title: 'Search' }

export default function SearchPage() {
  return <SearchContent />
}
