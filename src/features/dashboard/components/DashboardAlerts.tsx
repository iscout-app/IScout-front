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
          <AlertTriangle className="h-20 w-20 text-yellow-600" />
          Alertas
        </CardTitle>
        <p className="text-sm text-muted-foreground">Requer atenção</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-12">
          {alerts.length === 0 ? (
            <div className="flex items-center gap-12 p-16 rounded-lg bg-green-50 border border-green-200">
              <Info className="h-20 w-20 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">
                Nenhum alerta no momento
              </p>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-start gap-12 p-16 rounded-lg border ${
                  alert.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-blue-50 border-blue-300'
                }`}
              >
                {alert.type === 'warning' ? (
                  <AlertTriangle className="h-16 w-16 text-yellow-700 flex-shrink-0 mt-2" />
                ) : (
                  <Info className="h-16 w-16 text-blue-700 flex-shrink-0 mt-2" />
                )}
                <p
                  className={`text-sm font-medium ${
                    alert.type === 'warning'
                      ? 'text-yellow-900'
                      : 'text-blue-900'
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
