import { apiClient } from '@/lib/api/client'

export interface HistoryEvent {
  id: string
  type: 'treino' | 'partida'
  date: string
  title: string
  stats: Record<string, any>
  observations?: string
}

export interface PlayerHistoryData {
  player: {
    id: string
    name: string
    birthdate: string
    position: string
    shirtNumber: number
    stats: {
      matches: number
      goals: number
      assists: number
      yellowCards: number
      redCards: number
    }
  }
  events: HistoryEvent[]
}

export const historyApi = {
  // Get player history (trainings + matches)
  getPlayerHistory: async (teamId: string, athleteId: string) => {
    // For now, we'll fetch trainings and matches separately and combine them
    // In the future, the backend could provide a dedicated endpoint for this

    const [trainingsResponse, matchesResponse, playerResponse] = await Promise.all([
      apiClient.get(`/teams/${teamId}/trainings`),
      apiClient.get(`/matches`),
      apiClient.get(`/teams/${teamId}/athletes/${athleteId}`),
    ])

    return {
      player: playerResponse.data.data,
      trainings: trainingsResponse.data.data || [],
      matches: matchesResponse.data.data || [],
    }
  },
}
