import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TopPerformer } from '../types/dashboard.types'
import { Trophy } from 'lucide-react'

interface TopPlayersProps {
  players: TopPerformer[]
}

const MEDAL_COLORS = [
  'text-teal-500',
  'text-teal-500',
  'text-teal-600',
  'text-teal-600',
  'text-teal-700',
]
const MEDAL_BACKGROUNDS = [
  'bg-teal-500/15',
  'bg-teal-500/15',
  'bg-teal-600/15',
  'bg-teal-600/15',
  'bg-teal-700/15',
]

export function TopPlayers({ players }: TopPlayersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-20 w-20 text-primary" />
          Melhores Desempenhos
        </CardTitle>
        <p className="text-sm text-muted-foreground">Top 5 jogadores</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-12">
          {players.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-32">
              Nenhum dado disponível
            </p>
          ) : (
            players.slice(0, 5).map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-16 rounded-lg border border-border/50 bg-card hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-16">
                  <div
                    className={`flex h-32 w-32 items-center justify-center rounded-full ${MEDAL_BACKGROUNDS[index] || 'bg-muted'} ${MEDAL_COLORS[index] || 'text-muted-foreground'} font-bold text-base`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{player.average.toFixed(1)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
