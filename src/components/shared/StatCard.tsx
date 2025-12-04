import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode | string
  label: string
  value: string | number
  subtitle?: string
}

export function StatCard({ icon, label, value, subtitle }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-24">
        <div className="flex items-start gap-16">
          {/* Icon */}
          <div className="flex-shrink-0">
            {typeof icon === 'string' ? (
              <span className="text-5xl">{icon}</span>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center rounded-lg bg-muted/30">
                {icon}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-4">{label}</p>
            <div className="text-3xl font-bold">{value}</div>
            {subtitle && <p className="mt-4 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
