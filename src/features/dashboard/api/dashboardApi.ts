import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { DashboardSummary } from '../types/dashboard.types'

export const dashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummary>(API_ENDPOINTS.dashboard.summary)
    return response.data
  },
}
