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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          {typeof icon === 'string' ? <span className="text-2xl">{icon}</span> : icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
