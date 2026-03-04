import { cn } from '@/lib/utils'
import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export const EmptyState = ({ title, description, icon, className }: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
    <div className="mb-4 text-muted-foreground">
      {icon ?? <SearchX className="h-16 w-16 opacity-40" />}
    </div>
    <h3 className="text-lg font-medium text-foreground">{title}</h3>
    {description && (
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    )}
  </div>
)
