import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '../api/reports.api'
import { useTeam } from '@/features/teams/context/TeamContext'

export const REPORTS_QUERY_KEY = ['reports'] as const

/**
 * Hook to fetch player statistics for reports using new endpoints
 */
export function usePlayerStatsQuery(playerId: string | undefined) {
  const { currentTeam } = useTeam()

  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'player-stats', currentTeam?.id, playerId] as const,
    queryFn: () => {
      if (!playerId || !currentTeam?.id) return null
      return reportsApi.getPlayerStats(currentTeam.id, playerId)
    },
    enabled: !!playerId && !!currentTeam?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch player match history
 */
export function usePlayerMatchesQuery(playerId: string | undefined) {
  const { currentTeam } = useTeam()

  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'player-matches', currentTeam?.id, playerId] as const,
    queryFn: () => {
      if (!playerId || !currentTeam?.id) return null
      return reportsApi.getPlayerMatches(playerId, { teamId: currentTeam.id, limit: 100 })
    },
    enabled: !!playerId && !!currentTeam?.id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch player training participation
 */
export function usePlayerTrainingsQuery(playerId: string | undefined) {
  const { currentTeam } = useTeam()

  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'player-trainings', currentTeam?.id, playerId] as const,
    queryFn: () => {
      if (!playerId || !currentTeam?.id) return null
      return reportsApi.getPlayerTrainings(currentTeam.id, playerId, { limit: 100 })
    },
    enabled: !!playerId && !!currentTeam?.id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch complete player report data (stats + matches + trainings)
 */
export function usePlayerReportQuery(playerId: string | undefined) {
  const { currentTeam } = useTeam()

  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'player-complete', currentTeam?.id, playerId] as const,
    queryFn: () => {
      if (!playerId || !currentTeam?.id) return null
      return reportsApi.getCompletePlayerReport(currentTeam.id, playerId)
    },
    enabled: !!playerId && !!currentTeam?.id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch multiple players' stats for collective reports
 */
export function useMultiplePlayersStatsQuery(playerIds: string[]) {
  const { currentTeam } = useTeam()

  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'multiple-players', currentTeam?.id, playerIds] as const,
    queryFn: () => {
      if (!currentTeam?.id || playerIds.length === 0) return null
      return reportsApi.getMultiplePlayersStats(currentTeam.id, playerIds)
    },
    enabled: !!currentTeam?.id && playerIds.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}
