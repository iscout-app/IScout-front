import { apiClient } from '@/lib/api/client'
import type {
  MatchStatistics,
  CreateStatisticsDto,
  StatisticsFilters,
  StatisticsEvolutionPoint,
} from '../types/statistics.types'

export const statisticsApi = {
  create: async (data: CreateStatisticsDto) => {
    const response = await apiClient.post<{ success: boolean; data: MatchStatistics }>(
      '/stats',
      data
    )
    return response.data.data
  },

  getByPlayer: async (athleteId: string) => {
    const response = await apiClient.get<{ success: boolean; data: MatchStatistics[] }>(
      `/stats/player/${athleteId}`
    )
    return response.data.data
  },

  getEvolution: async (athleteId: string) => {
    const response = await apiClient.get<{
      success: boolean
      data: StatisticsEvolutionPoint[]
    }>(`/stats/evolution/${athleteId}`)
    return response.data.data
  },

  list: async (filters?: StatisticsFilters) => {
    const params = filters || {}
    const response = await apiClient.get<{ success: boolean; data: MatchStatistics[] }>(
      '/stats',
      { params }
    )
    return response.data.data
  },
}
