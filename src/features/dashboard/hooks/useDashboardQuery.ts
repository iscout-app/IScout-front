import { useQuery } from '@tanstack/react-query'
import { useTeam } from '@/features/teams/context/TeamContext'
import { playersApi } from '@/features/players/api/players.api'
import { matchesApi } from '@/features/matches/api/matches.api'
import { trainingsApi } from '@/features/trainings/api/trainings.api'
import { DashboardAggregator } from '../services/dashboardAggregator'
import type { DashboardSummary } from '../types/dashboard.types'

export function useDashboardQuery() {
  const { currentTeam } = useTeam()

  return useQuery({
    queryKey: ['dashboard', 'summary', currentTeam?.id],
    queryFn: async (): Promise<DashboardSummary> => {
      if (!currentTeam) {
        throw new Error('Nenhum time selecionado')
      }

      // Fetch all required data in parallel
      const [players, matches, trainings] = await Promise.all([
        playersApi.getAll(currentTeam.id),
        matchesApi.getAll({ teamId: currentTeam.id }),
        trainingsApi.getAll(currentTeam.id),
      ])

      // Aggregate data client-side
      return DashboardAggregator.aggregate(players, matches, trainings)
    },
    enabled: !!currentTeam,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
