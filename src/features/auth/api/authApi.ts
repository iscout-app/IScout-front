import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { LoginCredentials, AuthResponse } from '@/types/auth.types'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    )
    return response.data
  },

  // Logout is handled client-side only
  // Backend doesn't have logout endpoint
}
