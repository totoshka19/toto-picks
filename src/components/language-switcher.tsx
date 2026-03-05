'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export const LanguageSwitcher = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggle = () => {
    const next = locale === 'ru' ? 'en' : 'ru'
    router.replace(pathname, { locale: next })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="text-xs font-semibold w-10 h-8 tracking-wider"
    >
      {locale.toUpperCase()}
    </Button>
  )
}
