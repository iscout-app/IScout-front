export interface MatchStatistics {
  id?: string
  athleteId: string
  matchId: string
  teamId: string
  position: string
  minutesPlayed: number

  // Offensive stats
  goals: number
  assists: number
  shots: number
  shotsOnTarget: number

  // Passing stats
  accuratePasses: number
  inaccuratePasses: number

  // Defensive stats
  tackles: number
  interceptions: number
  foulsCommitted: number
  foulsSuffered: number

  // Cards
  yellowCards: number
  redCards: number

  // Performance rating (0-100, displayed as 0.0-10.0)
  performanceRating?: number
  observations?: string

  // Match info (from join)
  matchDate?: Date
  homeTeamId?: string
  awayTeamId?: string
  homeScore?: number
  awayScore?: number
}

export interface CreateStatisticsDto {
  athleteId: string
  matchId: string
  teamId: string
  position: string
  minutesPlayed: number
  goals: number
  assists: number
  shots: number
  shotsOnTarget: number
  accuratePasses: number
  inaccuratePasses: number
  tackles: number
  interceptions: number
  foulsCommitted: number
  foulsSuffered: number
  yellowCards: number
  redCards: number
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
