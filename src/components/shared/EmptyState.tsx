import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">{description}</p>}
        {action && <div className="mt-6">{action}</div>}
      </CardContent>
    </Card>
  )
}
