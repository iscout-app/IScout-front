export interface DashboardSummary {
  totalPlayers: number
  eventsThisWeek: number
  overallAverage: number
  goalsThisWeek: number
  topPerformers: TopPerformer[]
  recentMatches: RecentMatch[]
  activityData: ActivityData
  positionDistribution: PositionDistribution[]
  categoryPerformance: CategoryPerformance[]
}

export interface TopPerformer {
  id: string
  name: string
  position: string
  average: number
}

export interface RecentMatch {
  id: string
  playerId: string
  playerName: string
  eventType: 'treino' | 'partida'
  date: string
  goals: number
  assists: number
  rating: number
}

export interface ActivityData {
  labels: string[]
  training: number[]
  matches: number[]
}

export interface PositionDistribution {
  position: string
  count: number
}

export interface CategoryPerformance {
  category: string
  averageRating: number
}
