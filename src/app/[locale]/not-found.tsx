import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Film } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <Film className="h-20 w-20 text-muted-foreground opacity-30" />
      <div>
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <p className="text-xl font-medium">Page not found</p>
        <p className="text-sm text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
      </div>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
