import { apiClient } from '@/lib/api/client'
import type { Player } from '../types/player.types'

export interface CreatePlayerDto {
  name: string
  birthdate: string
  position: string
  shirtNumber: number
}

export interface UpdatePlayerDto {
  name?: string
  birthdate?: string
  position?: string
  shirtNumber?: number
}

// Backend athlete structure from athleteCareer
interface AthleteCareerResponse {
  athleteId: string
  teamId: string
  shirtNumber: number
  position: string
  matches: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  startedAt: string
  updatedAt?: string
  finishedAt?: string
  athlete: {
    id: string
    name: string
    birthdate: string
  }
}

// Transform backend athlete to frontend player
function transformAthleteToPlayer(athleteCareer: AthleteCareerResponse): Player {
  return {
    id: athleteCareer.athlete.id,
    name: athleteCareer.athlete.name,
    birthdate: athleteCareer.athlete.birthdate,
    position: athleteCareer.position,
    shirtNumber: athleteCareer.shirtNumber,
    teamId: athleteCareer.teamId,
    stats: {
      matches: athleteCareer.matches,
      goals: athleteCareer.goals,
      assists: athleteCareer.assists,
      yellowCards: athleteCareer.yellowCards,
      redCards: athleteCareer.redCards,
    },
  }
}

export const playersApi = {
  getAll: async (teamId: string) => {
    const response = await apiClient.get<AthleteCareerResponse[]>(
      `/teams/${teamId}/athletes`
    )

    // Handle both wrapped and unwrapped responses
    const data = Array.isArray(response.data) ? response.data : (response.data as any).data || []
    return data.map(transformAthleteToPlayer)
  },

  getById: async (athleteId: string, teamId: string) => {
    // Backend doesn't have a direct athlete endpoint, fetch all and filter
    const athletes = await playersApi.getAll(teamId)
    const athlete = athletes.find((a) => a.id === athleteId)

    if (!athlete) {
      throw new Error('Jogador não encontrado')
    }

    return athlete
  },

  create: async (teamId: string, data: CreatePlayerDto) => {
    const response = await apiClient.post<AthleteCareerResponse>(
      `/teams/${teamId}/athletes`,
      data
    )

    const athleteData = (response.data as any).data || response.data
    return transformAthleteToPlayer(athleteData)
  },

  update: async (athleteId: string, teamId: string, data: UpdatePlayerDto) => {
    // Backend doesn't have update athlete endpoint yet
    // For now, we'll need to handle this differently or wait for backend implementation
    throw new Error('Atualização de jogador ainda não implementada no backend')
  },

  delete: async (athleteId: string, teamId: string) => {
    // Backend doesn't have delete athlete endpoint yet
    throw new Error('Exclusão de jogador ainda não implementada no backend')
  },
}
