import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '../api/reports.api'
import { playersApi } from '@/features/players/api/players.api'
import { aggregatePlayerReport } from '../utils/reportAggregator'
import type { PlayerReportData } from '../types/reports.types'

export const REPORTS_QUERY_KEY = ['reports'] as const

/**
 * Hook to fetch player statistics for reports
 */
export function usePlayerStatsQuery(playerId: string | undefined) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'player-stats', playerId] as const,
    queryFn: () => (playerId ? reportsApi.getPlayerStats(playerId) : []),
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch player evolution data
 */
export function usePlayerEvolutionQuery(playerId: string | undefined) {
  return useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'player-evolution', playerId] as const,
    queryFn: () => (playerId ? reportsApi.getPlayerEvolution(playerId) : []),
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch complete player report data (player info + aggregated stats)
 */
export function usePlayerReportQuery(
  playerId: string | undefined,
  teamId?: string
): { data: PlayerReportData | null; isLoading: boolean; error: Error | null } {
  // Fetch player info
  const {
    data: player,
    isLoading: isLoadingPlayer,
    error: playerError,
  } = useQuery({
    queryKey: ['players', playerId, teamId] as const,
    queryFn: () => (playerId ? playersApi.getById(playerId, teamId) : null),
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000,
  })

  // Fetch player stats
  const {
    data: stats = [],
    isLoading: isLoadingStats,
    error: statsError,
  } = usePlayerStatsQuery(playerId)

  // Aggregate data
  const reportData =
    player && stats.length >= 0 ? aggregatePlayerReport(player, stats) : null

  return {
    data: reportData,
    isLoading: isLoadingPlayer || isLoadingStats,
    error: (playerError || statsError) as Error | null,
  }
}

/**
 * Hook to fetch multiple players' stats for collective reports
 */
export function useMultiplePlayersReportQuery(playerIds: string[], teamId?: string) {
  // Fetch all players info
  const playersQuery = useQuery({
    queryKey: ['players', 'all', teamId] as const,
    queryFn: () => playersApi.getAll(teamId),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch stats for selected players
  const statsQuery = useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'multiple-players', playerIds] as const,
    queryFn: () => reportsApi.getMultiplePlayersStats(playerIds),
    enabled: playerIds.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  // Aggregate reports for each player
  const reportData: PlayerReportData[] = []
  if (playersQuery.data && statsQuery.data) {
    const players = playersQuery.data.filter((p) => playerIds.includes(p.id))
    for (const player of players) {
      const stats = statsQuery.data[player.id] || []
      reportData.push(aggregatePlayerReport(player, stats))
    }
  }

  return {
    data: reportData,
    isLoading: playersQuery.isLoading || statsQuery.isLoading,
    error: (playersQuery.error || statsQuery.error) as Error | null,
  }
}
