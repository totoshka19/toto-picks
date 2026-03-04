import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingBadgeProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const RatingBadge = ({ rating, size = 'md', className }: RatingBadgeProps) => {
  const color =
    rating >= 7
      ? 'text-green-400'
      : rating >= 5
      ? 'text-yellow-400'
      : 'text-red-400'

  const sizes = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-base gap-1',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <span className={cn('inline-flex items-center font-semibold', sizes[size], color, className)}>
      <Star className={cn('fill-current', iconSizes[size])} />
      {rating.toFixed(1)}
    </span>
  )
}
