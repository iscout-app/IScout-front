import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { PlayerSelector } from '@/components/shared/PlayerSelector'
import { usePlayerEvolutionQuery } from '@/features/statistics/hooks/useStatisticsQuery'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// TODO: Get real teamId from auth context
const TEMP_TEAM_ID = '00000000-0000-0000-0000-000000000000'

export default function Evolution() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>()

  const { data: evolutionData, isLoading, isError } = usePlayerEvolutionQuery(selectedPlayerId)

  // Format date for charts
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  // Prepare chart data
  const chartData = evolutionData
    ? evolutionData.map((point) => ({
        date: formatDate(point.date.toString()),
        gols: point.goals,
        assistencias: point.assists,
        'Total (Gols + Assist.)': point.goals + point.assists,
        'Amarelos': point.yellowCards,
        'Vermelhos': point.redCards,
        'Acum. Gols': point.cumulativeGoals,
        'Acum. Assistências': point.cumulativeAssists,
      }))
    : []

  return (
    <div className="space-y-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evolução do Atleta</h1>
        <p className="mt-8 text-muted-foreground">
          Gráficos de evolução de desempenho ao longo do tempo
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
                placeholder="Escolha um jogador para ver a evolução..."
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
              description="Não foi possível carregar a evolução do jogador."
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
              description="Selecione um jogador acima para visualizar sua evolução de desempenho."
            />
          </CardContent>
        </Card>
      )}

      {/* Empty Evolution Data */}
      {selectedPlayerId && !isLoading && evolutionData && evolutionData.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              title="Sem dados de evolução"
              description="Este jogador ainda não possui dados suficientes para gerar gráficos de evolução."
            />
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      {evolutionData && evolutionData.length > 0 && (
        <>
          {/* Goals and Assists Per Match */}
          <Card>
            <CardHeader>
              <CardTitle>Gols e Assistências por Partida</CardTitle>
              <p className="text-sm text-muted-foreground">
                Desempenho ofensivo ao longo das partidas
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gols" fill="hsl(var(--primary))" name="Gols" />
                  <Bar dataKey="assistencias" fill="hsl(142 76% 36%)" name="Assistências" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cumulative Goals and Assists */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Acumulada - Gols e Assistências</CardTitle>
              <p className="text-sm text-muted-foreground">
                Progresso total ao longo da temporada
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Acum. Gols"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Gols Acumulados"
                  />
                  <Line
                    type="monotone"
                    dataKey="Acum. Assistências"
                    stroke="hsl(142 76% 36%)"
                    strokeWidth={2}
                    name="Assistências Acumuladas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Offensive Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Desempenho Ofensivo</CardTitle>
              <p className="text-sm text-muted-foreground">
                Soma de gols e assistências por partida
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Total (Gols + Assist.)"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    name="Total Gols + Assistências"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Discipline Evolution */}
          <Card>
            <CardHeader>
              <CardTitle>Disciplina - Cartões Recebidos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Histórico de cartões amarelos e vermelhos
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Amarelos" fill="hsl(48 96% 53%)" name="Cartões Amarelos" />
                  <Bar dataKey="Vermelhos" fill="hsl(0 84% 60%)" name="Cartões Vermelhos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
