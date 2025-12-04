import { apiClient } from '@/lib/api/client'

export interface Training {
  id: string
  teamId: string
  date: string
  concluded: boolean
  concludedAt?: string
}

export const trainingsApi = {
  getAll: async (teamId: string, filters?: { from?: string; to?: string }) => {
    const response = await apiClient.get<Training[]>(`/teams/${teamId}/trainings`, {
      params: filters,
    })
    const data = Array.isArray(response.data) ? response.data : (response.data as any).data || []
    return data
  },
}
