import { apiClient } from '@/lib/api/client'
import type { CreateUserDto, User } from '../types/users.types'

export const usersApi = {
  /**
   * Create a new user using the sign-up endpoint
   * Note: Backend doesn't have dedicated user management endpoints yet,
   * so we use the auth sign-up endpoint for user creation
   */
  create: async (data: CreateUserDto) => {
    const response = await apiClient.post<{ success: boolean; data: User }>('/auth/sign-up', {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    })
    return response.data.data
  },

  /**
   * Get all users
   * Note: This is a mock implementation as the backend doesn't have a users list endpoint
   * In a real implementation, this would call GET /users
   */
  getAll: async (): Promise<User[]> => {
    // Mock implementation - replace with real API call when backend is ready
    // const response = await apiClient.get<{ success: boolean; data: User[] }>('/users')
    // return response.data.data

    // For now, return empty array as we can't list users without backend support
    return []
  },

  /**
   * Get user by ID
   * Note: Mock implementation - replace when backend endpoint is available
   */
  getById: async (_id: string): Promise<User | null> => {
    // Mock implementation
    // const response = await apiClient.get<{ success: boolean; data: User }>(`/users/${id}`)
    // return response.data.data
    return null
  },

  /**
   * Update user
   * Note: Mock implementation - replace when backend endpoint is available
   */
  update: async (_id: string, _data: Partial<CreateUserDto>): Promise<User> => {
    // Mock implementation
    // const response = await apiClient.put<{ success: boolean; data: User }>(`/users/${id}`, data)
    // return response.data.data
    throw new Error('Update user endpoint not implemented in backend yet')
  },

  /**
   * Delete user
   * Note: Mock implementation - replace when backend endpoint is available
   */
  delete: async (_id: string): Promise<void> => {
    // Mock implementation
    // await apiClient.delete(`/users/${id}`)
    throw new Error('Delete user endpoint not implemented in backend yet')
  },
}
