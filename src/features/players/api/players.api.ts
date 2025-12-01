import { apiClient } from '@/lib/api/client'
import type { Player } from '../types/player.types'

export interface CreatePlayerDto {
  name: string
  birthdate: string
  teamId: string
  position: string
  shirtNumber: number
}

export interface UpdatePlayerDto {
  name?: string
  birthdate?: string
  position?: string
  shirtNumber?: number
}

export const playersApi = {
  getAll: async (teamId?: string) => {
    const params = teamId ? { teamId } : {}
    const response = await apiClient.get<{ success: boolean; data: Player[] }>(
      '/athletes',
      { params }
    )
    return response.data.data
  },

  getById: async (id: string, teamId?: string) => {
    const params = teamId ? { teamId } : {}
    const response = await apiClient.get<{ success: boolean; data: Player; error?: string }>(
      `/athletes/${id}`,
      { params }
    )

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Jogador não encontrado')
    }

    return response.data.data
  },

  create: async (data: CreatePlayerDto) => {
    const response = await apiClient.post<{ success: boolean; data: Player }>(
      '/athletes',
      data
    )
    return response.data.data
  },

  update: async (id: string, teamId: string, data: UpdatePlayerDto) => {
    const response = await apiClient.put<{ success: boolean; data: Player }>(
      `/athletes/${id}`,
      data,
      { params: { teamId } }
    )
    return response.data.data
  },

  delete: async (id: string, teamId: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/athletes/${id}`,
      { params: { teamId } }
    )
    return response.data
  },
}
