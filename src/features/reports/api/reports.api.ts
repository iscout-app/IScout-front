import { apiClient } from '@/lib/api/client'
import type { MatchStatistic } from '../types/reports.types'

/**
 * API client for fetching report-related data
 * Since there are no dedicated report endpoints, we aggregate data from existing endpoints
 */
export const reportsApi = {
  /**
   * Get all match statistics for a specific player
   */
  getPlayerStats: async (playerId: string): Promise<MatchStatistic[]> => {
    const response = await apiClient.get<MatchStatistic[]>(`/stats/player/${playerId}`)
    return response.data
  },

  /**
   * Get player evolution data over time
   */
  getPlayerEvolution: async (playerId: string) => {
    const response = await apiClient.get<
      Array<{
        date: string
        goals: number
        assists: number
        yellowCards: number
        redCards: number
        cumulativeGoals: number
        cumulativeAssists: number
        cumulativeYellowCards: number
        cumulativeRedCards: number
        matchId: string
      }>
    >(`/stats/player/${playerId}/evolution`)
    return response.data
  },

  /**
   * Get multiple players' stats for collective reports
   */
  getMultiplePlayersStats: async (
    playerIds: string[]
  ): Promise<Record<string, MatchStatistic[]>> => {
    // Fetch stats for each player in parallel
    const promises = playerIds.map(async (id) => ({
      id,
      stats: await reportsApi.getPlayerStats(id),
    }))

    const results = await Promise.all(promises)

    // Convert array to object keyed by player ID
    return results.reduce(
      (acc, { id, stats }) => {
        acc[id] = stats
        return acc
      },
      {} as Record<string, MatchStatistic[]>
    )
  },
}
