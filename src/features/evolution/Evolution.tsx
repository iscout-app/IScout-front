import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePlayersQuery } from '@/features/players/hooks/usePlayersQuery'
import { usePlayerHistoryQuery } from '@/features/history/hooks/useHistoryQuery'
import { useTeam } from '@/features/teams/context/TeamContext'
import { TrendingUp, Target, Users, Star } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts'

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

export default function Evolution() {
  const { currentTeam } = useTeam()
  const { data: players } = usePlayersQuery(currentTeam?.id)
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('')
  const [periodFilter, setPeriodFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const { data: historyData, isLoading } = usePlayerHistoryQuery(currentTeam?.id, selectedPlayerId)
  const selectedPlayer = players?.find((p: any) => p.id === selectedPlayerId)

  // Process events for charts
  const processedData = useMemo(() => {
    if (!historyData) return null

    const events: any[] = []

    // Process trainings
    historyData.trainings?.forEach((training: any) => {
      training.classes?.forEach((trainingClass: any) => {
        const athleteStats = trainingClass.athleteStats?.find((a: any) => a.athleteId === selectedPlayerId)
        if (athleteStats) {
          events.push({
            date: training.date,
            type: 'treino',
            stats: athleteStats.stats || {},
          })
        }
      })
    })

    // Process matches
    historyData.matches?.forEach((match: any) => {
      const athletePerformance = match.athletes?.find((a: any) => a.athleteId === selectedPlayerId)
      if (athletePerformance) {
        events.push({
          date: match.timestamp,
          type: 'partida',
          stats: {
            goals: athletePerformance.goals,
            assists: athletePerformance.assists,
            yellowCards: athletePerformance.yellowCards,
            redCards: athletePerformance.redCards,
          },
        })
      }
    })

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate metrics
    let totalGoals = 0
    let totalAssists = 0
    let totalRatings = 0
    let ratingCount = 0
    let trainingCount = 0
    let matchCount = 0

    const chartData = events.map((event) => {
      const stats = event.stats
      totalGoals += stats.goals || 0
      totalAssists += stats.assists || 0

      if (stats.performanceRating) {
        totalRatings += stats.performanceRating
        ratingCount++
      }

      if (event.type === 'treino') trainingCount++
      else matchCount++

      return {
        date: new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        fullDate: event.date,
        type: event.type,
        goals: stats.goals || 0,
        assists: stats.assists || 0,
        rating: stats.performanceRating || 0,
        passAccuracy: stats.accuratePasses && stats.inaccuratePasses
          ? Math.round((stats.accuratePasses / (stats.accuratePasses + stats.inaccuratePasses)) * 100)
          : 0,
        tackles: stats.tackles || 0,
        interceptions: stats.interceptions || 0,
        yellowCards: stats.yellowCards || 0,
        redCards: stats.redCards || 0,
      }
    })

    // KPIs
    const avgGoalsPerEvent = events.length > 0 ? (totalGoals / events.length).toFixed(1) : '0.0'
    const avgAssistsPerEvent = events.length > 0 ? (totalAssists / events.length).toFixed(1) : '0.0'
    const bestRating = chartData.reduce((max, d) => Math.max(max, d.rating), 0).toFixed(1)

    // Trend calculation (last 5 vs previous 5)
    let trend = 'Estável'
    if (chartData.length >= 10) {
      const last5Avg = chartData.slice(-5).reduce((sum, d) => sum + d.rating, 0) / 5
      const prev5Avg = chartData.slice(-10, -5).reduce((sum, d) => sum + d.rating, 0) / 5
      if (last5Avg > prev5Avg + 0.5) trend = 'Crescente'
      else if (last5Avg < prev5Avg - 0.5) trend = 'Decrescente'
    }

    return {
      chartData,
      kpis: {
        trend,
        avgGoalsPerEvent,
        avgAssistsPerEvent,
        bestRating,
      },
      distribution: [
        { name: 'Treinos', value: trainingCount },
        { name: 'Partidas', value: matchCount },
      ],
    }
  }, [historyData, selectedPlayerId])

  const COLORS = ['#0ea5e9', '#10b981']

  return (
    <div className="space-y-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evolução do Atleta</h1>
        <p className="mt-8 text-muted-foreground">
          Visualize a evolução temporal do desempenho através de gráficos
        </p>
      </div>

      {/* Player Selection */}
      <Card className="p-24">
        <div className="space-y-8">
          <Label htmlFor="player-select">Selecione o Jogador</Label>
          <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
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
                  <p className="text-foreground">
                    {getAgeCategory(selectedPlayer.birthdate)}
                  </p>
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
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="h-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo o Período</SelectItem>
                <SelectItem value="last30">Últimos 30 dias</SelectItem>
                <SelectItem value="last90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Treinos e Partidas</SelectItem>
                <SelectItem value="treino">Apenas Treinos</SelectItem>
                <SelectItem value="partida">Apenas Partidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {processedData && (
        <div className="grid gap-20 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-20">
            <div className="flex items-center gap-12">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-24 w-24 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tendência Geral</p>
                <p className="text-2xl font-bold text-teal-600">→ {processedData.kpis.trend}</p>
              </div>
            </div>
          </Card>

          <Card className="p-20">
            <div className="flex items-center gap-12">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-24 w-24 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gols por Evento</p>
                <p className="text-3xl font-bold">{processedData.kpis.avgGoalsPerEvent}</p>
              </div>
            </div>
          </Card>

          <Card className="p-20">
            <div className="flex items-center gap-12">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-destructive/10">
                <Users className="h-24 w-24 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assist. por Evento</p>
                <p className="text-3xl font-bold">{processedData.kpis.avgAssistsPerEvent}</p>
              </div>
            </div>
          </Card>

          <Card className="p-20">
            <div className="flex items-center gap-12">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-yellow-500/10">
                <Star className="h-24 w-24 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Melhor Nota</p>
                <p className="text-3xl font-bold">{processedData.kpis.bestRating}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      {processedData && processedData.chartData.length > 0 && (
        <div className="grid gap-24 md:grid-cols-2">
          {/* Performance Rating Evolution */}
          <Card className="p-24">
            <h3 className="mb-4 text-lg font-semibold">Evolução da Nota de Desempenho</h3>
            <p className="mb-16 text-sm text-muted-foreground">Acompanhe a evolução da nota ao longo do tempo</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={processedData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Area type="monotone" dataKey="rating" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Goals and Assists */}
          <Card className="p-24">
            <h3 className="mb-4 text-lg font-semibold">Gols e Assistências</h3>
            <p className="mb-16 text-sm text-muted-foreground">Participações ofensivas ao longo do tempo</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="goals" fill="#0ea5e9" name="Gols" />
                <Bar dataKey="assists" fill="#f59e0b" name="Assistências" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pass Accuracy */}
          <Card className="p-24">
            <h3 className="mb-4 text-lg font-semibold">Precisão de Passes</h3>
            <p className="mb-16 text-sm text-muted-foreground">Evolução da qualidade técnica dos passes</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={processedData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="passAccuracy"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Defensive Actions */}
          <Card className="p-24">
            <h3 className="mb-4 text-lg font-semibold">Ações Defensivas</h3>
            <p className="mb-16 text-sm text-muted-foreground">Desarmes e interceptações ao longo do tempo</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tackles" fill="#3b82f6" name="Desarmes" />
                <Bar dataKey="interceptions" fill="#8b5cf6" name="Interceptações" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Discipline */}
          <Card className="p-24">
            <h3 className="mb-4 text-lg font-semibold">Disciplina</h3>
            <p className="mb-16 text-sm text-muted-foreground">Cartões recebidos ao longo do tempo</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="yellowCards" fill="#eab308" name="Cartões Amarelos" />
                <Bar dataKey="redCards" fill="#ef4444" name="Cartões Vermelhos" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Training vs Matches Distribution */}
          <Card className="p-24">
            <h3 className="mb-4 text-lg font-semibold">Desempenho: Treinos vs Partidas</h3>
            <p className="mb-16 text-sm text-muted-foreground">Comparação de notas entre treinos e partidas</p>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={processedData.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {processedData.distribution.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {!selectedPlayer && (
        <Card className="p-48">
          <div className="flex flex-col items-center justify-center gap-16 text-center">
            <div className="text-6xl opacity-30">📈</div>
            <div>
              <h3 className="text-xl font-semibold">Nenhum jogador selecionado</h3>
              <p className="text-muted-foreground mt-4">
                Selecione um jogador acima para visualizar sua evolução de desempenho
              </p>
            </div>
          </div>
        </Card>
      )}

      {selectedPlayer && processedData && processedData.chartData.length === 0 && !isLoading && (
        <Card className="p-48">
          <div className="flex flex-col items-center justify-center gap-16 text-center">
            <div className="text-6xl opacity-30">📊</div>
            <div>
              <h3 className="text-xl font-semibold">Sem dados suficientes</h3>
              <p className="text-muted-foreground mt-4">
                Este jogador ainda não possui dados suficientes para gerar gráficos de evolução
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
