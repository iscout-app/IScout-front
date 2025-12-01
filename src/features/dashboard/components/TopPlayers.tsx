import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TopPerformer } from '../types/dashboard.types'
import { Trophy } from 'lucide-react'

interface TopPlayersProps {
  players: TopPerformer[]
}

const MEDAL_COLORS = ['text-yellow-500', 'text-gray-400', 'text-orange-600']
const MEDAL_BACKGROUNDS = ['bg-yellow-500/10', 'bg-gray-400/10', 'bg-orange-600/10']

export function TopPlayers({ players }: TopPlayersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-5 w-5 text-primary" />
          Melhores Desempenhos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Nenhum dado disponível
            </p>
          ) : (
            players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${MEDAL_BACKGROUNDS[index] || 'bg-muted'} ${MEDAL_COLORS[index] || 'text-muted-foreground'} font-bold text-sm`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.position}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {player.average.toFixed(1)}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
