import { apiClient } from '@/lib/api/client'

/**
 * API client for fetching report-related data
 * Uses the new dedicated endpoints implemented in the backend
 */
export const reportsApi = {
  /**
   * Get complete statistics for a specific player in a team
   * GET /teams/:teamId/athletes/:athleteId/stats
   */
  getPlayerStats: async (teamId: string, playerId: string) => {
    const response = await apiClient.get<{
      athlete: {
        id: string
        name: string
        birthdate: string
      }
      career: {
        shirtNumber: number
        position: string
        startedAt: string
        finishedAt: string | null
        isActive: boolean
      }
      stats: {
        matches: number
        goals: number
        assists: number
        yellowCards: number
        redCards: number
        goalsPerMatch: number
        assistsPerMatch: number
      }
    }>(`/teams/${teamId}/athletes/${playerId}/stats`)
    return response.data
  },

  /**
   * Get match history for a specific player with filters
   * GET /athletes/:playerId/matches
   */
  getPlayerMatches: async (
    playerId: string,
    options?: {
      teamId?: string
      from?: string
      to?: string
      limit?: number
      offset?: number
    }
  ) => {
    const response = await apiClient.get<{
      success: boolean
      data: Array<{
        matchId: string
        timestamp: string
        teamId: string
        team: {
          name: string
          shortName: string
        }
        opponent: {
          id: string
          name: string
          shortName: string
        }
        homeAway: 'home' | 'away'
        result: 'win' | 'draw' | 'loss'
        score: {
          home: number
          away: number
          team: number
          opponent: number
        }
        performance: {
          position: string
          goals: number
          assists: number
          yellowCards: number
          redCards: number
        }
      }>
    }>(`/athletes/${playerId}/matches`, { params: options })
    return response.data.data || response.data
  },

  /**
   * Get training participation for a specific player in a team
   * GET /teams/:teamId/athletes/:athleteId/trainings
   */
  getPlayerTrainings: async (
    teamId: string,
    playerId: string,
    options?: {
      from?: string
      to?: string
      limit?: number
      offset?: number
    }
  ) => {
    const response = await apiClient.get<{
      success: boolean
      data: {
        trainings: Array<{
          id: string
          date: string
          concluded: boolean
          concludedAt: Date | string | null
          classes: Array<{
            id: string
            title: string
            description: string | null
            concluded: boolean
            present: boolean
            notes: string | null
            stats: any
          }>
        }>
        summary: {
          totalTrainings: number
          totalClasses: number
          attendedClasses: number
          missedClasses: number
          attendanceRate: number
        }
      }
    }>(`/teams/${teamId}/athletes/${playerId}/trainings`, { params: options })
    return response.data.data || response.data
  },

  /**
   * Get complete player report data (stats + matches + trainings)
   * Aggregates data from multiple endpoints
   */
  getCompletePlayerReport: async (teamId: string, playerId: string) => {
    const results = await Promise.allSettled([
      reportsApi.getPlayerStats(teamId, playerId),
      reportsApi.getPlayerMatches(playerId, { teamId, limit: 100 }),
      reportsApi.getPlayerTrainings(teamId, playerId, { limit: 100 }),
    ])

    return {
      stats: results[0].status === 'fulfilled' ? results[0].value : null,
      matches: results[1].status === 'fulfilled' ? results[1].value : [],
      trainings: results[2].status === 'fulfilled' ? results[2].value : null,
    }
  },

  /**
   * Get multiple players' stats for collective reports
   */
  getMultiplePlayersStats: async (teamId: string, playerIds: string[]) => {
    // Fetch stats for each player in parallel
    const promises = playerIds.map(async (id) => ({
      id,
      data: await reportsApi.getPlayerStats(teamId, id),
    }))

    const results = await Promise.all(promises)

    // Convert array to object keyed by player ID
    return results.reduce(
      (acc, { id, data }) => {
        acc[id] = data
        return acc
      },
      {} as Record<string, Awaited<ReturnType<typeof reportsApi.getPlayerStats>>>
    )
  },
}
