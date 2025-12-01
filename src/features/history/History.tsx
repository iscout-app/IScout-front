import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { PlayerSelector } from '@/components/shared/PlayerSelector'
import { usePlayerStatisticsQuery } from '@/features/statistics/hooks/useStatisticsQuery'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import type { MatchStatistics } from '@/features/statistics/types/statistics.types'

// TODO: Get real teamId from auth context
const TEMP_TEAM_ID = '00000000-0000-0000-0000-000000000000'

export default function History() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>()

  const { data: playerStats, isLoading, isError } = usePlayerStatisticsQuery(selectedPlayerId)

  // Calculate aggregated stats
  const aggregatedStats = useMemo(() => {
    if (!playerStats || playerStats.length === 0) return null

    const totals = playerStats.reduce(
      (acc, stat) => ({
        matches: acc.matches + 1,
        minutesPlayed: acc.minutesPlayed + stat.minutesPlayed,
        goals: acc.goals + stat.goals,
        assists: acc.assists + stat.assists,
        shots: acc.shots + stat.shots,
        shotsOnTarget: acc.shotsOnTarget + stat.shotsOnTarget,
        accuratePasses: acc.accuratePasses + stat.accuratePasses,
        inaccuratePasses: acc.inaccuratePasses + stat.inaccuratePasses,
        tackles: acc.tackles + stat.tackles,
        interceptions: acc.interceptions + stat.interceptions,
        yellowCards: acc.yellowCards + stat.yellowCards,
        redCards: acc.redCards + stat.redCards,
      }),
      {
        matches: 0,
        minutesPlayed: 0,
        goals: 0,
        assists: 0,
        shots: 0,
        shotsOnTarget: 0,
        accuratePasses: 0,
        inaccuratePasses: 0,
        tackles: 0,
        interceptions: 0,
        yellowCards: 0,
        redCards: 0,
      }
    )

    const totalPasses = totals.accuratePasses + totals.inaccuratePasses
    const passAccuracy = totalPasses > 0 ? Math.round((totals.accuratePasses / totalPasses) * 100) : 0

    return {
      ...totals,
      passAccuracy,
      avgGoalsPerMatch: totals.matches > 0 ? (totals.goals / totals.matches).toFixed(2) : '0.00',
      avgAssistsPerMatch: totals.matches > 0 ? (totals.assists / totals.matches).toFixed(2) : '0.00',
      shotAccuracy:
        totals.shots > 0 ? Math.round((totals.shotsOnTarget / totals.shots) * 100) : 0,
    }
  }, [playerStats])

  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="space-y-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Desempenho</h1>
        <p className="mt-8 text-muted-foreground">
          Timeline de eventos e estatísticas dos jogadores
        </p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label htmlFor="player-select">Selecione um Jogador</Label>
            <div className="mt-8">
              <PlayerSelector
                value={selectedPlayerId}
                onChange={setSelectedPlayerId}
                teamId={TEMP_TEAM_ID}
                placeholder="Escolha um jogador para ver o histórico..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              title="Erro ao carregar dados"
              description="Não foi possível carregar o histórico do jogador."
            />
          </CardContent>
        </Card>
      )}

      {/* No Player Selected */}
      {!selectedPlayerId && !isLoading && (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              title="Nenhum jogador selecionado"
              description="Selecione um jogador acima para visualizar seu histórico de desempenho."
            />
          </CardContent>
        </Card>
      )}

      {/* Empty Stats */}
      {selectedPlayerId && !isLoading && playerStats && playerStats.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              title="Sem estatísticas registradas"
              description="Este jogador ainda não possui estatísticas registradas."
            />
          </CardContent>
        </Card>
      )}

      {/* Aggregated Stats Summary */}
      {aggregatedStats && playerStats && playerStats.length > 0 && (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/8 to-primary/3 shadow-md">
          <CardHeader className="pb-16">
            <CardTitle className="text-lg font-bold text-primary">Estatísticas Totais</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-16 md:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Partidas</p>
                <p className="mt-4 text-2xl font-bold">{aggregatedStats.matches}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gols</p>
                <p className="mt-4 text-2xl font-bold">{aggregatedStats.goals}</p>
                <p className="text-xs text-muted-foreground">
                  Média: {aggregatedStats.avgGoalsPerMatch}/partida
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assistências</p>
                <p className="mt-4 text-2xl font-bold">{aggregatedStats.assists}</p>
                <p className="text-xs text-muted-foreground">
                  Média: {aggregatedStats.avgAssistsPerMatch}/partida
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minutos Jogados</p>
                <p className="mt-4 text-2xl font-bold">{aggregatedStats.minutesPlayed}</p>
              </div>
            </div>

            <div className="mt-24 grid gap-16 border-t border-primary/20 pt-16 md:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Precisão de Passe</p>
                <p className="mt-4 text-2xl font-bold">{aggregatedStats.passAccuracy}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Precisão de Finalizações</p>
                <p className="mt-4 text-2xl font-bold">{aggregatedStats.shotAccuracy}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ações Defensivas</p>
                <p className="mt-4 text-2xl font-bold">
                  {aggregatedStats.tackles + aggregatedStats.interceptions}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cartões</p>
                <p className="mt-4 text-2xl font-bold">
                  <span className="text-yellow-600">{aggregatedStats.yellowCards}</span> /{' '}
                  <span className="text-red-600">{aggregatedStats.redCards}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match History Timeline */}
      {playerStats && playerStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Timeline de Partidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-16">
              {playerStats.map((stat: MatchStatistics, index: number) => (
                <div
                  key={stat.id || index}
                  className="flex gap-16 border-l-2 border-primary/30 pl-16 pb-16"
                >
                  <div className="flex-shrink-0">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-8 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">
                          Partida - {formatDate(stat.matchDate)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Posição: {stat.position} • {stat.minutesPlayed} minutos
                        </p>
                      </div>
                      {stat.performanceRating !== undefined && (
                        <div className="rounded-md bg-primary/10 px-12 py-4">
                          <span className="text-sm font-bold text-primary">
                            Nota: {(stat.performanceRating / 10).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-12 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Ofensivo</p>
                        <p className="text-sm font-medium">
                          {stat.goals} gols • {stat.assists} assistências
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.shotsOnTarget}/{stat.shots} finalizações
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Passes</p>
                        <p className="text-sm font-medium">
                          {stat.accuratePasses + stat.inaccuratePasses} passes
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.accuratePasses + stat.inaccuratePasses > 0
                            ? Math.round(
                                (stat.accuratePasses /
                                  (stat.accuratePasses + stat.inaccuratePasses)) *
                                  100
                              )
                            : 0}
                          % precisão
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Defesa</p>
                        <p className="text-sm font-medium">
                          {stat.tackles} desarmes • {stat.interceptions} interceptações
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Disciplina</p>
                        <p className="text-sm font-medium">
                          {stat.yellowCards === 0 && stat.redCards === 0 ? (
                            'Sem cartões'
                          ) : (
                            <>
                              {stat.yellowCards > 0 && (
                                <span className="text-yellow-600">{stat.yellowCards} amarelo(s)</span>
                              )}
                              {stat.yellowCards > 0 && stat.redCards > 0 && ' • '}
                              {stat.redCards > 0 && (
                                <span className="text-red-600">{stat.redCards} vermelho(s)</span>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {stat.observations && (
                      <div className="mt-12 rounded-md bg-muted/50 p-12">
                        <p className="text-xs font-medium text-muted-foreground">Observações:</p>
                        <p className="mt-4 text-sm">{stat.observations}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
