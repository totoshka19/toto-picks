import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { tmdbProfile } from '@/lib/tmdb'
import { Skeleton } from '@/components/ui/skeleton'
import type { Cast, Person } from '@/types/tmdb'

interface PersonCardProps {
  person: Cast | Person
  role?: string
}

export const PersonCard = ({ person, role }: PersonCardProps) => {
  const profileUrl = tmdbProfile(person.profile_path, 'md')
  const subtitle = role ?? ('character' in person ? person.character : undefined) ?? person.known_for_department

  return (
    <Link href={`/person/${person.id}`} className="group block w-[120px] shrink-0">
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="relative aspect-[2/3] bg-muted overflow-hidden">
          {profileUrl ? (
            <Image
              src={profileUrl}
              alt={person.name}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground text-xs">
              {person.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="p-1.5">
          <p className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {person.name}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export const PersonCardSkeleton = () => (
  <div className="w-[120px] shrink-0 rounded-lg overflow-hidden bg-card">
    <Skeleton className="aspect-[2/3] w-full" />
    <div className="p-1.5 space-y-1">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
)
