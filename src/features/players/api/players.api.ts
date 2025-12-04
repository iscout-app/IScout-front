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

// Backend athlete structure from athleteCareer (nested format from GET)
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

// Backend athlete structure from create (flat format from POST)
interface AthleteCreateResponse {
  id: string
  name: string
  birthdate: string
  athleteId: string
  teamId: string
  shirtNumber: number
  position: string
  matches?: number
  goals?: number
  assists?: number
  yellowCards?: number
  redCards?: number
  startedAt?: string
  updatedAt?: string
  finishedAt?: string
}

// Transform backend athlete to frontend player
function transformAthleteToPlayer(athleteCareer: AthleteCareerResponse | AthleteCreateResponse): Player {
  // Check if it's the nested format (GET) or flat format (POST)
  const isNested = 'athlete' in athleteCareer && athleteCareer.athlete !== undefined

  if (isNested) {
    const nested = athleteCareer as AthleteCareerResponse
    return {
      id: nested.athlete.id,
      name: nested.athlete.name,
      birthdate: nested.athlete.birthdate,
      position: nested.position,
      shirtNumber: nested.shirtNumber,
      teamId: nested.teamId,
      stats: {
        matches: nested.matches,
        goals: nested.goals,
        assists: nested.assists,
        yellowCards: nested.yellowCards,
        redCards: nested.redCards,
      },
    }
  } else {
    const flat = athleteCareer as AthleteCreateResponse
    return {
      id: flat.id,
      name: flat.name,
      birthdate: flat.birthdate,
      position: flat.position,
      shirtNumber: flat.shirtNumber,
      teamId: flat.teamId,
      stats: {
        matches: flat.matches || 0,
        goals: flat.goals || 0,
        assists: flat.assists || 0,
        yellowCards: flat.yellowCards || 0,
        redCards: flat.redCards || 0,
      },
    }
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
    const athlete = athletes.find((a: Player) => a.id === athleteId)

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

  update: async (_athleteId: string, _teamId: string, _data: UpdatePlayerDto) => {
    // Backend doesn't have update athlete endpoint yet
    // For now, we'll need to handle this differently or wait for backend implementation
    throw new Error('Atualização de jogador ainda não implementada no backend')
  },

  delete: async (_athleteId: string, _teamId: string) => {
    // Backend doesn't have delete athlete endpoint yet
    throw new Error('Exclusão de jogador ainda não implementada no backend')
  },
}
