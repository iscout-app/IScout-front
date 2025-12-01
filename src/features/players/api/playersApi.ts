import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { Player, CreatePlayerDto, UpdatePlayerDto } from '../types/player.types'

export const playersApi = {
  async getAll(): Promise<Player[]> {
    const response = await apiClient.get<Player[]>(API_ENDPOINTS.players.list)
    return response.data
  },

  async getById(id: string): Promise<Player> {
    const response = await apiClient.get<Player>(API_ENDPOINTS.players.byId(id))
    return response.data
  },

  async create(data: CreatePlayerDto): Promise<Player> {
    const response = await apiClient.post<Player>(API_ENDPOINTS.players.create, data)
    return response.data
  },

  async update(id: string, data: UpdatePlayerDto): Promise<Player> {
    const response = await apiClient.put<Player>(API_ENDPOINTS.players.update(id), data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.players.delete(id))
  },
}
