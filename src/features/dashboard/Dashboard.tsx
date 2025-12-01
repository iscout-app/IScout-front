import { useDashboardQuery } from './hooks/useDashboardQuery'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityChart } from './components/ActivityChart'
import { PositionChart } from './components/PositionChart'
import { CategoryChart } from './components/CategoryChart'
import { TopPlayers } from './components/TopPlayers'
import { RecentStats } from './components/RecentStats'
import { Users, Calendar, TrendingUp, Target } from 'lucide-react'

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardQuery()

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Erro ao carregar dashboard"
        description={error instanceof Error ? error.message : 'Erro desconhecido'}
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        icon="📊"
        title="Nenhum dado disponível"
        description="Comece cadastrando jogadores e registrando estatísticas"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral do desempenho da equipe
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-primary" />}
          label="Total de Jogadores"
          value={data.totalPlayers}
          subtitle="Cadastrados no sistema"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5 text-orange-500" />}
          label="Eventos desta Semana"
          value={data.eventsThisWeek}
          subtitle="Partidas e treinos"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          label="Média Geral"
          value={data.overallAverage.toFixed(1)}
          subtitle="Desempenho da equipe"
        />
        <StatCard
          icon={<Target className="h-5 w-5 text-purple-500" />}
          label="Gols na Semana"
          value={data.goalsThisWeek}
          subtitle="Total marcado"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityChart data={data.activityData} />
        <PositionChart data={data.positionDistribution} />
      </div>

      {/* Category Performance */}
      <div className="grid gap-6">
        <CategoryChart data={data.categoryPerformance} />
      </div>

      {/* Top Players and Recent Matches */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopPlayers players={data.topPerformers} />
        <RecentStats matches={data.recentMatches} />
      </div>
    </div>
  )
}
