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
      // Note: trainings endpoint may fail due to database schema issues
      const [players, matches, trainingsResult] = await Promise.allSettled([
        playersApi.getAll(currentTeam.id),
        matchesApi.getAll({ teamId: currentTeam.id }),
        trainingsApi.getAll(currentTeam.id),
      ])

      // Extract values, using empty arrays for failed requests
      const playersData = players.status === 'fulfilled' ? players.value : []
      const matchesData = matches.status === 'fulfilled' ? matches.value : []
      const trainingsData = trainingsResult.status === 'fulfilled' ? trainingsResult.value : []

      // Log any failures for debugging
      if (players.status === 'rejected') console.warn('Failed to fetch players:', players.reason)
      if (matches.status === 'rejected') console.warn('Failed to fetch matches:', matches.reason)
      if (trainingsResult.status === 'rejected') console.warn('Failed to fetch trainings:', trainingsResult.reason)

      // Aggregate data client-side
      return DashboardAggregator.aggregate(playersData, matchesData, trainingsData)
    },
    enabled: !!currentTeam,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
