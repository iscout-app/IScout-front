// Backend matchAthletes structure (limited fields)
export interface BackendMatchAthlete {
  athleteId: string
  matchId: string
  teamId: string
  position: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

// Frontend MatchStatistics (extended for future use)
export interface MatchStatistics {
  id?: string
  athleteId: string
  matchId: string
  teamId: string
  position: string
  minutesPlayed?: number // Not in backend

  // Offensive stats
  goals: number
  assists: number
  shots?: number // Not in backend
  shotsOnTarget?: number // Not in backend

  // Passing stats
  accuratePasses?: number // Not in backend
  inaccuratePasses?: number // Not in backend

  // Defensive stats
  tackles?: number // Not in backend
  interceptions?: number // Not in backend
  foulsCommitted?: number // Not in backend
  foulsSuffered?: number // Not in backend

  // Cards
  yellowCards: number
  redCards: number

  // Performance rating (calculated client-side)
  performanceRating?: number
  observations?: string

  // Match info (from join)
  matchDate?: Date
  homeTeamId?: string
  awayTeamId?: string
  homeScore?: number
  awayScore?: number
}

// DTO for creating statistics (only backend-supported fields required)
export interface CreateStatisticsDto {
  athleteId: string
  matchId: string
  teamId: string
  position: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number

  // Optional extended fields (not sent to backend)
  minutesPlayed?: number
  shots?: number
  shotsOnTarget?: number
  accuratePasses?: number
  inaccuratePasses?: number
  tackles?: number
  interceptions?: number
  foulsCommitted?: number
  foulsSuffered?: number
  performanceRating?: number
  observations?: string
}

export interface StatisticsFilters {
  athleteId?: string
  matchId?: string
  teamId?: string
}

export interface StatisticsEvolutionPoint {
  date: Date
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  cumulativeGoals: number
  cumulativeAssists: number
  cumulativeYellowCards: number
  cumulativeRedCards: number
  matchId: string
}
