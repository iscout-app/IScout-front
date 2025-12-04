import { useDashboardQuery } from './hooks/useDashboardQuery'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityChart } from './components/ActivityChart'
import { PositionChart } from './components/PositionChart'
import { CategoryChart } from './components/CategoryChart'
import { TopPlayers } from './components/TopPlayers'
import { RecentStats } from './components/RecentStats'
import { DashboardAlerts } from './components/DashboardAlerts'
import { Users, Plus, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { USER_ROLE_LABELS } from '@/features/users/types/users.types'

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardQuery()
  const navigate = useNavigate()
  const { user } = useAuth()

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

  const userRoleLabel = user?.role ? USER_ROLE_LABELS[user.role] : 'Usuário'

  return (
    <div className="space-y-24">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {userRoleLabel}</h1>
          <p className="mt-8 text-muted-foreground">
            Visão geral do sistema
          </p>
        </div>
        <div className="flex gap-12">
          <Button onClick={() => navigate('/jogadores/novo')} className="h-50">
            <Plus className="h-18 w-18 mr-8" />
            Novo Jogador
          </Button>
          <Button onClick={() => navigate('/estatisticas')} variant="outline" className="h-50">
            <BarChart3 className="h-18 w-18 mr-8" />
            Registrar Estatística
          </Button>
          <Button onClick={() => navigate('/jogadores')} variant="outline" className="h-50">
            Ver Todos
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-32 w-32 text-blue-500" />}
          label="Total de Jogadores"
          value={data.totalPlayers}
        />
        <StatCard
          icon={<BarChart3 className="h-32 w-32 text-orange-500" />}
          label="Eventos Esta Semana"
          value={data.eventsThisWeek}
        />
        <StatCard
          icon="⭐"
          label="Média Geral"
          value={data.overallAverage?.toFixed(1) ?? '0.0'}
        />
        <StatCard
          icon="⚽"
          label="Gols Esta Semana"
          value={data.goalsThisWeek}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-24 lg:grid-cols-2">
        <ActivityChart data={data.activityData} />
        <TopPlayers players={data.topPerformers} />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-24 lg:grid-cols-2">
        <div className="space-y-24">
          <RecentStats matches={data.recentMatches} />
          <PositionChart data={data.positionDistribution} />
        </div>
        <div className="space-y-24">
          <CategoryChart data={data.categoryPerformance} />
          <DashboardAlerts players={data.topPerformers} />
        </div>
      </div>
    </div>
  )
}
