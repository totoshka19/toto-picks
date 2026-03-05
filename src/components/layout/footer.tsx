import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Film } from 'lucide-react'

export const Footer = () => {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')

  return (
    <footer className="mt-auto border-t border-border/50 bg-card/50">
      <div className="container mx-auto max-w-7xl px-4 min-[576px]:px-8 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <Film className="h-5 w-5" />
            <span>toto-picks</span>
          </Link>

          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">{tNav('home')}</Link>
            <Link href="/movies" className="hover:text-foreground transition-colors">{tNav('movies')}</Link>
            <Link href="/shows" className="hover:text-foreground transition-colors">{tNav('shows')}</Link>
            <Link href="/favorites" className="hover:text-foreground transition-colors">{tNav('favorites')}</Link>
            <Link href="/watched" className="hover:text-foreground transition-colors">{tNav('watched')}</Link>
          </nav>

          <p className="text-xs text-muted-foreground">
            {t('tmdbCredit')}{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              {t('tmdbName')}
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t('copyright')}
        </p>
      </div>
    </footer>
  )
}
