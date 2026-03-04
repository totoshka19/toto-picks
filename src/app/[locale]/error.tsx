'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isTMDBKeyMissing =
    error.message?.includes('401') ||
    error.message?.includes('API key') ||
    error.message?.includes('fetch failed')

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <AlertCircle className="h-16 w-16 text-destructive opacity-60" />
      <h2 className="text-xl font-semibold">
        {isTMDBKeyMissing ? 'TMDB API Key not configured' : 'Something went wrong'}
      </h2>
      {isTMDBKeyMissing && (
        <p className="text-sm text-muted-foreground max-w-sm">
          Add your TMDB API key to <code className="text-primary">.env.local</code>:
          <br />
          <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
            NEXT_PUBLIC_TMDB_API_KEY=your_key
          </code>
          <br />
          Then restart <code className="text-primary">npm run dev</code>
        </p>
      )}
      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  )
}
