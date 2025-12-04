export interface PlayerReportData {
  // Player basic info
  id: string
  name: string
  position: string
  birthdate: string
  shirtNumber: number
  teamId: string

  // Aggregated statistics
  totalMatches: number
  totalGoals: number
  totalAssists: number
  totalYellowCards: number
  totalRedCards: number
  averageRating: number

  // Performance metrics
  goalsPerMatch: number
  assistsPerMatch: number
  passAccuracy: number
  tacklesPerMatch: number
  interceptionsPerMatch: number

  // Evolution data for charts
  evolution: {
    date: string
    goals: number
    assists: number
    rating: number
    yellowCards: number
    redCards: number
  }[]
}

export interface MatchStatistic {
  id: string
  athleteId: string
  matchId: string
  teamId: string
  position: string
  minutesPlayed: number

  // Offensive
  goals: number
  assists: number
  shots: number
  shotsOnTarget: number

  // Passing
  accuratePasses: number
  inaccuratePasses: number

  // Defensive
  tackles: number
  interceptions: number
  foulsCommitted: number
  foulsSuffered: number

  // Cards
  yellowCards: number
  redCards: number

  // Performance
  performanceRating?: number
  observations?: string

  // Match context
  matchDate: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number
  awayScore: number
}

export interface CollectiveReportData {
  players: PlayerReportData[]
  comparisonMetrics: {
    topScorer: string
    topAssister: string
    bestRating: string
    mostDisciplined: string
  }
}

export interface ReportGenerationProgress {
  isGenerating: boolean
  progress: number
  status: string
}
