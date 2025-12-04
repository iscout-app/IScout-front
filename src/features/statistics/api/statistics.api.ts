import { apiClient } from '@/lib/api/client'
import type {
  MatchStatistics,
  CreateStatisticsDto,
  StatisticsFilters,

  BackendMatchAthlete,
} from '../types/statistics.types'
import { RatingCalculator } from '../services/ratingCalculator'

/**
 * Transform backend matchAthlete to frontend MatchStatistics
 */
function transformMatchAthlete(backend: BackendMatchAthlete): MatchStatistics {
  const stats: MatchStatistics = {
    athleteId: backend.athleteId,
    matchId: backend.matchId,
    teamId: backend.teamId,
    position: backend.position,
    goals: backend.goals,
    assists: backend.assists,
    yellowCards: backend.yellowCards,
    redCards: backend.redCards,
  }

  // Calculate rating client-side
  stats.performanceRating = RatingCalculator.calculate(stats)

  return stats
}

/**
 * Transform frontend CreateStatisticsDto to backend payload
 * Only send fields that backend supports
 */
function transformToBackend(data: CreateStatisticsDto): BackendMatchAthlete {
  return {
    athleteId: data.athleteId,
    matchId: data.matchId,
    teamId: data.teamId,
    position: data.position,
    goals: data.goals,
    assists: data.assists,
    yellowCards: data.yellowCards,
    redCards: data.redCards,
  }
}

export const statisticsApi = {
  create: async (data: CreateStatisticsDto) => {
    // Transform to backend format
    const backendData = transformToBackend(data)

    // Backend endpoint is part of match creation
    // For now, we'll use a placeholder endpoint
    const response = await apiClient.post<BackendMatchAthlete>('/stats', backendData)

    const result = (response.data as any).data || response.data
    return transformMatchAthlete(result)
  },

  getByPlayer: async (_athleteId: string) => {
    // Backend doesn't have this endpoint yet
    // Would need to fetch all matches and filter by athleteId
    throw new Error('Consulta de estatísticas por jogador ainda não implementada no backend')
  },

  getEvolution: async (_athleteId: string) => {
    // Backend doesn't have this endpoint yet
    throw new Error('Evolução de estatísticas ainda não implementada no backend')
  },

  list: async (_filters?: StatisticsFilters) => {
    // Backend doesn't have a dedicated stats list endpoint
    // Statistics are part of match data
    throw new Error('Listagem de estatísticas ainda não implementada no backend')
  },
}
