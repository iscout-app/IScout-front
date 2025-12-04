import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePlayersQuery } from '@/features/players/hooks/usePlayersQuery'
import { usePlayerHistoryQuery } from './hooks/useHistoryQuery'
import { useTeam } from '@/features/teams/context/TeamContext'
import { Target, Users, BarChart3, Star } from 'lucide-react'

function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

function getAgeCategory(birthdate: string): string {
  const age = calculateAge(birthdate)

  if (age > 23) {
    return 'PROFISSIONAL'
  }

  // Categorias de base: SUB-11, SUB-13, SUB-15, SUB-17, SUB-20, SUB-23
  if (age <= 11) return 'SUB-11'
  if (age <= 13) return 'SUB-13'
  if (age <= 15) return 'SUB-15'
  if (age <= 17) return 'SUB-17'
  if (age <= 20) return 'SUB-20'
  return 'SUB-23'
}

export default function History() {
  const { currentTeam } = useTeam()
  const { data: players } = usePlayersQuery(currentTeam?.id)
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all')
  const [periodFilter, setPeriodFilter] = useState<string>('all')

  const { data: historyData, isLoading } = usePlayerHistoryQuery(currentTeam?.id, selectedPlayerId)

  const selectedPlayer = players?.find((p: any) => p.id === selectedPlayerId)

  // Combine and process events
  const allEvents = useMemo(() => {
    if (!historyData) return []

    const events: any[] = []

    // Process trainings
    historyData.trainings?.forEach((training: any) => {
      training.classes?.forEach((trainingClass: any) => {
        const athleteStats = trainingClass.athleteStats?.find((a: any) => a.athleteId === selectedPlayerId)
        if (athleteStats) {
          events.push({
            id: `training-${training.id}-${trainingClass.id}`,
            type: 'treino',
            date: training.date,
            title: trainingClass.title,
            description: trainingClass.description,
            stats: athleteStats.stats || {},
            observations: athleteStats.stats?.observations,
          })
        }
      })
    })

    // Process matches
    historyData.matches?.forEach((match: any) => {
      const athletePerformance = match.athletes?.find((a: any) => a.athleteId === selectedPlayerId)
      if (athletePerformance) {
        const isHome = match.homeTeamId === currentTeam?.id
        const score = `${match.homeScore}x${match.awayScore}`

        events.push({
          id: `match-${match.id}`,
          type: 'partida',
          date: match.timestamp,
          title: `${isHome ? 'Casa' : 'Fora'} - ${score}`,
          stats: {
            position: athletePerformance.position,
            goals: athletePerformance.goals,
            assists: athletePerformance.assists,
            yellowCards: athletePerformance.yellowCards,
            redCards: athletePerformance.redCards,
          },
          observations: athletePerformance.observations,
        })
      }
    })

    // Sort by date descending
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [historyData, selectedPlayerId, currentTeam?.id])

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (!selectedPlayer || allEvents.length === 0) {
      return {
        totalGoals: 0,
        totalAssists: 0,
        totalEvents: 0,
        avgRating: 0,
      }
    }

    let totalGoals = 0
    let totalAssists = 0
    let totalRatings = 0
    let ratingCount = 0

    allEvents.forEach((event) => {
      totalGoals += event.stats?.goals || 0
      totalAssists += event.stats?.assists || 0

      if (event.stats?.performanceRating) {
        totalRatings += event.stats.performanceRating
        ratingCount++
      }
    })

    return {
      totalGoals,
      totalAssists,
      totalEvents: allEvents.length,
      avgRating: ratingCount > 0 ? (totalRatings / ratingCount).toFixed(1) : '0.0',
    }
  }, [selectedPlayer, allEvents])

  // Apply filters
  const filteredEvents = useMemo(() => {
    let filtered = [...allEvents]

    // Filter by event type
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter((event) => event.type === eventTypeFilter)
    }

    // Filter by period (TODO: implement date range filtering)
    // For now, periodFilter is just a placeholder

    return filtered
  }, [allEvents, eventTypeFilter, periodFilter])

  const clearFilters = () => {
    setEventTypeFilter('all')
    setPeriodFilter('all')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="space-y-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Desempenho</h1>
        <p className="mt-8 text-muted-foreground">
          Visualize o histórico detalhado de treinos e partidas
        </p>
      </div>

      {/* Player Selection */}
      <Card className="p-24">
        <div className="space-y-8">
          <Label htmlFor="player-select">Selecione o Jogador</Label>
          <Select value={selectedPlayerId || undefined} onValueChange={setSelectedPlayerId}>
            <SelectTrigger id="player-select" className="h-100">
              <SelectValue placeholder="Escolha um jogador..." />
            </SelectTrigger>
            <SelectContent>
              {players?.map((player: any) => (
                <SelectItem key={player.id} value={player.id}>
                  {player.name} - {player.position} (#{player.shirtNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Player Info Card */}
      {selectedPlayer && (
        <Card className="p-24">
          <div className="flex items-center gap-16">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-700 text-2xl font-bold text-white">
              {selectedPlayer.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .substring(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{selectedPlayer.name}</h3>
              <div className="mt-4 flex items-center gap-16 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">POSIÇÃO</span>
                  <p className="text-foreground">{selectedPlayer.position}</p>
                </div>
                <div>
                  <span className="font-medium">CATEGORIA</span>
                  <p className="text-foreground">{getAgeCategory(selectedPlayer.birthdate)}</p>
                </div>
                <div>
                  <span className="font-medium">IDADE</span>
                  <p className="text-foreground">{calculateAge(selectedPlayer.birthdate)} anos</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      {selectedPlayer && (
        <div className="grid gap-16 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="h-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="treino">Treinos</SelectItem>
                <SelectItem value="partida">Partidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="h-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo o Período</SelectItem>
                <SelectItem value="last7">Últimos 7 dias</SelectItem>
                <SelectItem value="last30">Últimos 30 dias</SelectItem>
                <SelectItem value="last90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="secondary" onClick={clearFilters} className="h-100">
            Limpar Filtros
          </Button>
        </div>
      )}

      {/* KPI Cards */}
      {selectedPlayer && filteredEvents.length > 0 && (
        <div className="grid gap-20 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-20">
            <div className="flex items-center gap-12">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-24 w-24 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Gols</p>
                <p className="text-3xl font-bold">{kpis.totalGoals}</p>
              </div>
            </div>
          </Card>

          <Card className="p-20">
            <div className="flex items-center gap-12">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-destructive/10">
                <Users className="h-24 w-24 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assistências</p>
                <p className="text-3xl font-bold">{kpis.totalAssists}</p>
              </div>
            </div>
          </Card>

          <Card className="p-20">
            <div className="flex items-center gap-12">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-blue-500/10">
                <BarChart3 className="h-24 w-24 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Partidas/Treinos</p>
                <p className="text-3xl font-bold">{kpis.totalEvents}</p>
              </div>
            </div>
          </Card>

          <Card className="p-20">
            <div className="flex items-center gap-12">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-yellow-500/10">
                <Star className="h-24 w-24 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média de Nota</p>
                <p className="text-3xl font-bold">{kpis.avgRating}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Timeline */}
      {selectedPlayer && filteredEvents.length > 0 && (
        <Card className="p-24">
          <div className="mb-16">
            <h3 className="text-lg font-semibold">Linha do Tempo</h3>
            <p className="text-sm text-muted-foreground">{filteredEvents.length} eventos encontrados</p>
          </div>

          <div className="relative space-y-24">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="relative flex gap-16">
                {/* Timeline line */}
                {index < filteredEvents.length - 1 && (
                  <div className="absolute left-[8px] top-[40px] bottom-[-24px] w-[2px] bg-border" />
                )}

                {/* Timeline dot */}
                <div className="relative flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary" />
                </div>

                {/* Event content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-16 mb-8">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{formatDate(event.date)}</p>
                      <h4 className="text-lg font-semibold">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-4">{event.description}</p>
                      )}
                    </div>
                    <span
                      className={`rounded px-8 py-4 text-xs font-bold uppercase ${
                        event.type === 'partida'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-teal-500/10 text-teal-500'
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid gap-12 md:grid-cols-4 mt-12">
                    {event.stats.goals !== undefined && (
                      <div>
                        <p className="text-xs text-muted-foreground">⚽ {event.stats.goals} gol(s)</p>
                      </div>
                    )}
                    {event.stats.assists !== undefined && (
                      <div>
                        <p className="text-xs text-muted-foreground">🎯 {event.stats.assists} assistência(s)</p>
                      </div>
                    )}
                    {event.stats.accuratePasses !== undefined && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          📊 {Math.round(
                            (event.stats.accuratePasses / (event.stats.accuratePasses + event.stats.inaccuratePasses)) * 100
                          )}% precisão
                        </p>
                      </div>
                    )}
                    {event.stats.performanceRating && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          ⭐ {event.stats.performanceRating.toFixed(1)} nota
                        </p>
                      </div>
                    )}
                    {(event.stats.yellowCards > 0 || event.stats.redCards > 0) && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {event.stats.yellowCards > 0 && `🟨 ${event.stats.yellowCards}`}
                          {event.stats.yellowCards > 0 && event.stats.redCards > 0 && ' '}
                          {event.stats.redCards > 0 && `🟥 ${event.stats.redCards}`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Observations */}
                  {event.observations && (
                    <div className="mt-12 rounded-md bg-muted/50 p-12">
                      <p className="text-xs text-muted-foreground">{event.observations}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty state */}
      {!selectedPlayer && (
        <Card className="p-48">
          <div className="flex flex-col items-center justify-center gap-16 text-center">
            <div className="text-6xl opacity-30">📊</div>
            <div>
              <h3 className="text-xl font-semibold">Nenhum jogador selecionado</h3>
              <p className="text-muted-foreground mt-4">
                Selecione um jogador acima para visualizar seu histórico de desempenho
              </p>
            </div>
          </div>
        </Card>
      )}

      {selectedPlayer && filteredEvents.length === 0 && !isLoading && (
        <Card className="p-48">
          <div className="flex flex-col items-center justify-center gap-16 text-center">
            <div className="text-6xl opacity-30">📝</div>
            <div>
              <h3 className="text-xl font-semibold">Nenhum evento encontrado</h3>
              <p className="text-muted-foreground mt-4">
                Este jogador ainda não possui treinos ou partidas registradas
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
