import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RecentMatch } from '../types/dashboard.types'
import { Calendar, Trophy, Target } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface RecentStatsProps {
  matches: RecentMatch[]
}

export function RecentStats({ matches }: RecentStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-18 w-18 text-primary" />
          Últimos Registros
        </CardTitle>
        <p className="text-sm text-muted-foreground">Estatísticas recentes</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-16">
          {matches.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-32">
              Nenhum registro disponível
            </p>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className="flex items-start justify-between p-16 rounded-lg border-l-4 border-l-primary bg-card hover:bg-accent/30 transition-colors"
              >
                <div className="flex-1 space-y-8">
                  <h4 className="font-bold text-base">{match.playerName}</h4>
                  <div className="flex items-center gap-8 flex-wrap">
                    <Badge
                      variant={match.eventType === 'partida' ? 'default' : 'secondary'}
                      className="text-xs uppercase"
                    >
                      {match.eventType === 'partida' ? 'PARTIDA' : 'TREINO'}
                    </Badge>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <Target className="h-12 w-12" />
                      <span>{match.goals} gol{match.goals !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <Trophy className="h-12 w-12" />
                      <span>{match.assists} assist{match.assists !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      ★ <span>{match.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground ml-12">
                  {format(new Date(match.date), "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
