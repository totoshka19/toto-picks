'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HorizontalScrollProps {
  children: React.ReactNode
  className?: string
}

export const HorizontalScroll = ({ children, className }: HorizontalScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative group/scroll">
      {/* Left button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll('left')}
        className={cn(
          'absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full',
          'bg-background/90 border border-border shadow-lg backdrop-blur-sm',
          'opacity-0 group-hover/scroll:opacity-100 transition-opacity',
          'hidden md:flex'
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className={cn(
          'flex gap-3 overflow-x-auto scrollbar-none pb-1',
          '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
          className
        )}
      >
        {children}
      </div>

      {/* Right button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll('right')}
        className={cn(
          'absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full',
          'bg-background/90 border border-border shadow-lg backdrop-blur-sm',
          'opacity-0 group-hover/scroll:opacity-100 transition-opacity',
          'hidden md:flex'
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
