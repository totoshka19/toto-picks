'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { tmdbSearch, tmdbProfile } from '@/lib/tmdb'
import { Input } from '@/components/ui/input'
import { X, Search } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Person } from '@/types/tmdb'
import type { PersonFilter } from '@/types/app'

interface PersonSearchInputProps {
  value: PersonFilter | null
  onChange: (person: PersonFilter | null) => void
  placeholder?: string
}

export const PersonSearchInput = ({ value, onChange, placeholder }: PersonSearchInputProps) => {
  const t = useTranslations('filters')
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Person[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await tmdbSearch.person(query, 1, locale)
        setResults(res.results.slice(0, 6))
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, locale])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const select = (person: Person) => {
    onChange({ id: person.id, name: person.name })
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  const clear = () => {
    onChange(null)
    setQuery('')
  }

  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm">
        <span className="flex-1 truncate">{value.name}</span>
        <button onClick={clear} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-border bg-popover shadow-lg overflow-hidden">
          {loading && (
            <div className="px-3 py-2 text-xs text-muted-foreground">{t('searching')}</div>
          )}
          {results.map((person) => {
            const profileUrl = tmdbProfile(person.profile_path, 'sm')
            return (
              <button
                key={person.id}
                onClick={() => select(person)}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 text-left text-sm',
                  'hover:bg-accent hover:text-accent-foreground transition-colors'
                )}
              >
                <div className="relative h-8 w-6 shrink-0 overflow-hidden rounded bg-muted">
                  {profileUrl ? (
                    <Image src={profileUrl} alt={person.name} fill sizes="24px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs">{person.name[0]}</div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{person.name}</p>
                  {person.known_for_department && (
                    <p className="text-xs text-muted-foreground">{person.known_for_department}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
