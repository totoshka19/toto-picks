import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Search' }

export default function SearchPage() {
  return <SearchContent />
}

import { SearchContent } from '@/features/search/search-content'
