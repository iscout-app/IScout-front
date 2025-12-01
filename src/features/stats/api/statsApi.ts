import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { Stat, CreateStatDto, UpdateStatDto } from '../types/stat.types'

export const statsApi = {
  async getAll(): Promise<Stat[]> {
    const response = await apiClient.get<Stat[]>(API_ENDPOINTS.stats.list)
    return response.data
  },

  async getById(id: string): Promise<Stat> {
    const response = await apiClient.get<Stat>(API_ENDPOINTS.stats.byId(id))
    return response.data
  },

  async getByPlayerId(playerId: string): Promise<Stat[]> {
    const response = await apiClient.get<Stat[]>(API_ENDPOINTS.stats.byPlayer(playerId))
    return response.data
  },

  async create(data: CreateStatDto): Promise<Stat> {
    const response = await apiClient.post<Stat>(API_ENDPOINTS.stats.create, data)
    return response.data
  },

  async update(id: string, data: UpdateStatDto): Promise<Stat> {
    const response = await apiClient.put<Stat>(API_ENDPOINTS.stats.update(id), data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.stats.delete(id))
  },
}
