'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination = ({ page, totalPages, onPageChange, className }: PaginationProps) => {
  const t = useTranslations('common')
  // TMDB max is 500 pages
  const maxPages = Math.min(totalPages, 500)

  if (maxPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const delta = 2

    for (let i = 1; i <= maxPages; i++) {
      if (
        i === 1 ||
        i === maxPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i)
      } else if (
        pages[pages.length - 1] !== 'ellipsis'
      ) {
        pages.push('ellipsis')
      }
    }
    return pages
  }

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">{t('previous')}</span>
      </Button>

      {getPageNumbers().map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'ghost'}
            size="icon"
            onClick={() => onPageChange(p)}
            className="h-9 w-9 text-sm"
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= maxPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">{t('next')}</span>
      </Button>
    </div>
  )
}
