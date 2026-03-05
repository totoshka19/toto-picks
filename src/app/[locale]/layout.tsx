import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from '@/providers/query-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { routing } from '@/i18n/routing'
import '../globals.css'

const geist = Geist({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'toto-picks — Movie & Series Catalog',
    template: '%s | toto-picks',
  },
  description: 'Discover movies and TV shows with advanced filters',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
      </head>
      <body className={`${geist.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <TooltipProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </TooltipProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
