import { apiClient } from '@/lib/api/client'

// Training API Types
export interface CreateTrainingDto {
  teamId: string
  date: string // YYYY-MM-DD format
}

export interface CreateTrainingClassDto {
  title: string
  description?: string
}

export interface AthleteTrainingStatsDto {
  athleteId: string
  notes?: string
  stats?: Record<string, any> // Flexible JSON object for any stats
}

export interface Training {
  id: string
  teamId: string
  date: string
  createdAt: string
}

export interface TrainingClass {
  id: string
  trainingId: string
  title: string
  description: string | null
  createdAt: string
}

// Match API Types
export interface CreateMatchDto {
  homeTeamId: string
  awayTeamId: string
  timestamp: string // ISO datetime
  homeScore: number
  awayScore: number
  athletes?: Array<{
    athleteId: string
    teamId: string
    position: string
    goals: number
    assists: number
    yellowCards: number
    redCards: number
  }>
}

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  timestamp: string
  homeScore: number
  awayScore: number
  createdAt: string
}

// Training API Methods
export const trainingsApi = {
  // Step 1: Create training
  createTraining: async (data: CreateTrainingDto) => {
    const response = await apiClient.post<{ success: boolean; data: Training }>(
      `/teams/${data.teamId}/trainings`,
      { date: data.date }
    )
    return response.data.data
  },

  // Step 2: Create training class
  createTrainingClass: async (teamId: string, trainingId: string, data: CreateTrainingClassDto) => {
    const response = await apiClient.post<{ success: boolean; data: TrainingClass }>(
      `/teams/${teamId}/trainings/${trainingId}/classes`,
      data
    )
    return response.data.data
  },

  // Step 3: Add athlete stats to training class
  addAthleteStats: async (
    teamId: string,
    trainingId: string,
    classId: string,
    data: AthleteTrainingStatsDto
  ) => {
    const response = await apiClient.post(
      `/teams/${teamId}/trainings/${trainingId}/classes/${classId}/athletes`,
      data
    )
    return response.data
  },
}

// Match API Methods
export const matchesApi = {
  // Create match with athletes
  createMatch: async (data: CreateMatchDto) => {
    const response = await apiClient.post<{ success: boolean; data: Match }>('/matches', data)
    return response.data.data
  },
}
