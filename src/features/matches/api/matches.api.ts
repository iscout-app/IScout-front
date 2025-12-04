import { apiClient } from '@/lib/api/client'

export interface Match {
  id: string
  timestamp: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number
  awayScore: number
}

export interface MatchAthlete {
  athleteId: string
  matchId: string
  teamId: string
  position: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

export interface MatchWithAthletes extends Match {
  athletes?: MatchAthlete[]
}

export const matchesApi = {
  getAll: async (filters?: { teamId?: string; from?: string; to?: string }) => {
    const response = await apiClient.get<Match[]>('/matches', { params: filters })
    const data = Array.isArray(response.data) ? response.data : (response.data as any).data || []
    return data
  },

  getById: async (id: string) => {
    const response = await apiClient.get<MatchWithAthletes>(`/matches/${id}`)
    return (response.data as any).data || response.data
  },
}
