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

    const [trainingsResponse, matchesResponse, playerStatsResponse] = await Promise.all([
      apiClient.get(`/teams/${teamId}/trainings`),
      apiClient.get(`/matches`, { params: { teamId } }),
      apiClient.get(`/teams/${teamId}/athletes/${athleteId}/stats`),
    ])

    const stats = playerStatsResponse.data

    // Extract data from response - check if it's wrapped in {success, data} or direct array
    const trainings = Array.isArray(trainingsResponse.data)
      ? trainingsResponse.data
      : (trainingsResponse.data.data || trainingsResponse.data)

    const matches = Array.isArray(matchesResponse.data)
      ? matchesResponse.data
      : (matchesResponse.data.data || matchesResponse.data)

    return {
      player: {
        id: stats.athlete.id,
        name: stats.athlete.name,
        birthdate: stats.athlete.birthdate,
        position: stats.career.position,
        shirtNumber: stats.career.shirtNumber,
        stats: {
          matches: stats.stats.matches,
          goals: stats.stats.goals,
          assists: stats.stats.assists,
          yellowCards: stats.stats.yellowCards,
          redCards: stats.stats.redCards,
        },
      },
      trainings,
      matches,
    }
  },
}
