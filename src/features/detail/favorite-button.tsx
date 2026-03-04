'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavoritesStore } from '@/store/favorites'
import { cn } from '@/lib/utils'
import type { FavoriteItem } from '@/types/app'

export const FavoriteButton = ({ item }: { item: FavoriteItem }) => {
  const t = useTranslations('movie')
  const { add, remove, has } = useFavoritesStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isFavorite = mounted && has(item.id, item.mediaType)

  const toggle = () => {
    isFavorite ? remove(item.id, item.mediaType) : add(item)
  }

  return (
    <Button
      variant={isFavorite ? 'default' : 'outline'}
      size="lg"
      onClick={toggle}
      className="gap-2"
    >
      <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
      {isFavorite ? t('removeFavorite') : t('addFavorite')}
    </Button>
  )
}
