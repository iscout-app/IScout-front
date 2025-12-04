import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Info } from 'lucide-react'
import type { TopPerformer } from '../types/dashboard.types'

interface DashboardAlertsProps {
  players: TopPerformer[]
}

interface Alert {
  type: 'warning' | 'info'
  message: string
}

export function DashboardAlerts({ players }: DashboardAlertsProps) {
  // Generate alerts based on player data
  const alerts: Alert[] = []

  // Check for players without recent stats (mock - in real app, would check actual dates)
  if (players.length > 0) {
    players.slice(0, 5).forEach((player) => {
      alerts.push({
        type: 'warning',
        message: `${player.name} não tem registros nos últimos 30 dias`,
      })
    })
  }

  // Add system demonstration alert
  if (players.length === 0) {
    alerts.push({
      type: 'info',
      message: 'Sistema em demonstração - Dados fictícios para fins de teste',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-18 w-18 text-yellow-600" />
          Alertas
        </CardTitle>
        <p className="text-sm text-muted-foreground">Requer atenção</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-12">
          {alerts.length === 0 ? (
            <div className="flex items-center gap-12 p-16 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
              <Info className="h-18 w-18 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-300">
                Nenhum alerta no momento
              </p>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-start gap-12 p-16 rounded-lg border ${
                  alert.type === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900'
                    : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
                }`}
              >
                {alert.type === 'warning' ? (
                  <AlertTriangle className="h-16 w-16 text-yellow-600 flex-shrink-0 mt-2" />
                ) : (
                  <Info className="h-16 w-16 text-blue-600 flex-shrink-0 mt-2" />
                )}
                <p
                  className={`text-sm ${
                    alert.type === 'warning'
                      ? 'text-yellow-800 dark:text-yellow-300'
                      : 'text-blue-800 dark:text-blue-300'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
