import { apiClient } from '@/lib/api/client'
import type { Team, CreateTeamDto, UpdateTeamDto } from '../types/team.types'

export const teamsApi = {
  getAll: async () => {
    const response = await apiClient.get<{ success: boolean; data: Team[] }>('/teams')
    return response.data.data || response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Team }>(`/teams/${id}`)
    return response.data.data || response.data
  },

  create: async (data: CreateTeamDto) => {
    const response = await apiClient.post<{ success: boolean; data: Team }>('/teams', data)
    return response.data.data || response.data
  },

  update: async (id: string, data: UpdateTeamDto) => {
    const response = await apiClient.patch<{ success: boolean; data: Team }>(`/teams/${id}`, data)
    return response.data.data || response.data
  },
}
