import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Genre } from '@/types/tmdb'

interface GenreChipsProps {
  genres: Genre[]
}

export const GenreChips = ({ genres }: GenreChipsProps) => {
  const t = useTranslations('home')

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">{t('genres')}</h2>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/movies?genres=${genre.id}`}
            className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium transition-all hover:border-primary hover:text-primary hover:bg-primary/10"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
