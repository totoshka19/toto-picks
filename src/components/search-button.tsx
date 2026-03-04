'use client'

import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export const SearchButton = () => {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push('/search')}
      aria-label="Search"
    >
      <Search className="h-5 w-5" />
    </Button>
  )
}
