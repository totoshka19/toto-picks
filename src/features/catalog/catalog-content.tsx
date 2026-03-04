'use client'

import { useState, Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { useFiltersStore } from '@/store/filters'
import { useDiscoverQuery } from './use-discover-query'
import { useFiltersUrlSync } from '@/hooks/use-filters-url-sync'
import { FiltersSidebar } from '@/features/filters/filters-sidebar'
import { MovieCard, MovieCardSkeleton } from '@/components/cards/movie-card'
import { Pagination } from '@/components/pagination'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SlidersHorizontal } from 'lucide-react'
import type { Genre } from '@/types/tmdb'
import type { MediaType } from '@/types/app'
import { SORT_OPTIONS, SORT_OPTIONS_TV } from '@/lib/constants'

interface CatalogContentProps {
  genres: Genre[]
  mediaType: MediaType
}

const CatalogGrid = ({ genres, mediaType }: CatalogContentProps) => {
  const { data, isLoading } = useDiscoverQuery(mediaType)
  const store = useFiltersStore()
  const t = useTranslations('catalog')

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!data?.results.length) {
    return <EmptyState title={t('noResults')} description={t('noResultsDesc')} />
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {data.results.map((item) => (
          <MovieCard key={item.id} item={item} mediaType={mediaType} genres={genres} />
        ))}
      </div>
      <Pagination
        page={store.page}
        totalPages={data.total_pages}
        onPageChange={(p) => { store.setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        className="mt-8"
      />
    </>
  )
}

export const CatalogContent = ({ genres, mediaType }: CatalogContentProps) => {
  const t = useTranslations('filters')
  const store = useFiltersStore()
  const { pushFiltersToUrl } = useFiltersUrlSync()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const sortOptions = mediaType === 'movie' ? SORT_OPTIONS : SORT_OPTIONS_TV
  const tSort = useTranslations('sort')

  const handleApply = () => {
    pushFiltersToUrl()
    setMobileFiltersOpen(false)
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar: desktop */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 rounded-xl border border-border bg-card p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <FiltersSidebar genres={genres} onApply={handleApply} />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Sort bar */}
        <div className="flex items-center justify-between gap-3 mb-5">
          {/* Mobile filters button */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                {t('openFilters')}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto pt-12">
              <FiltersSidebar genres={genres} onApply={handleApply} />
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Select
            value={store.sortBy}
            onValueChange={(v) => { store.setSortBy(v); handleApply() }}
          >
            <SelectTrigger className="w-48 h-8 text-sm ml-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {tSort(opt.labelKey as Parameters<typeof tSort>[0])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Suspense fallback={null}>
          <CatalogGrid genres={genres} mediaType={mediaType} />
        </Suspense>
      </div>
    </div>
  )
}
