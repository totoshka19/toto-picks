'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SearchButton } from '@/components/search-button'
import { Menu, Film, Heart, Home, Tv, Eye } from 'lucide-react'
import { useFavoritesStore } from '@/store/favorites'
import { useWatchedStore } from '@/store/watched'

const navItems = [
  { href: '/', labelKey: 'home', icon: Home },
  { href: '/movies', labelKey: 'movies', icon: Film },
  { href: '/shows', labelKey: 'shows', icon: Tv },
  { href: '/favorites', labelKey: 'favorites', icon: Heart },
  { href: '/watched', labelKey: 'watched', icon: Eye },
] as const

export const Header = () => {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const favoritesCount = useFavoritesStore((s) => s.items.length)
  const watchedCount = useWatchedStore((s) => s.items.length)

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navItems.map(({ href, labelKey, icon: Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        const count =
          labelKey === 'favorites' ? favoritesCount
          : labelKey === 'watched' ? watchedCount
          : 0
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{t(labelKey)}</span>
            {count > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground leading-none">
                {count}
              </span>
            )}
          </Link>
        )
      })}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 min-[576px]:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Film className="h-6 w-6" />
          <span>toto-picks</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* Right: search + language + mobile */}
        <div className="flex items-center gap-2">
          <SearchButton />
          <LanguageSwitcher />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 pt-12">
              <nav className="flex flex-col gap-6 mt-4">
                <NavLinks onClick={() => setMobileOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
