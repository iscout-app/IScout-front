import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RecentMatch } from '../types/dashboard.types'
import { Calendar, MapPin } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface RecentStatsProps {
  matches: RecentMatch[]
}

export function RecentStats({ matches }: RecentStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-5 w-5 text-primary" />
          Partidas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Nenhuma partida registrada
            </p>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{match.opponent}</h4>
                    <Badge
                      variant={
                        match.result === 'Vitória'
                          ? 'default'
                          : match.result === 'Derrota'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="text-xs"
                    >
                      {match.result}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{match.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(match.date), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">
                      Gols: <span className="font-semibold text-foreground">{match.goals}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Jogadores: <span className="font-semibold text-foreground">{match.playersCount}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{match.score}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
