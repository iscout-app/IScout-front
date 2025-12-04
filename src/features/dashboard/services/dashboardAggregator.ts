import type {
  DashboardSummary,
  TopPerformer,
  RecentMatch,
  ActivityData,
  PositionDistribution,
  CategoryPerformance,
} from '../types/dashboard.types'
import type { Player } from '@/features/players/types/player.types'
import type { Match } from '@/features/matches/api/matches.api'
import type { Training } from '@/features/trainings/api/trainings.api'

/**
 * Aggregate dashboard data from multiple API calls
 */
export class DashboardAggregator {
  /**
   * Calculate dashboard summary from players, matches, and trainings
   */
  static aggregate(
    players: Player[],
    matches: Match[],
    trainings: Training[]
  ): DashboardSummary {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Total players
    const totalPlayers = players.length

    // Events this week (matches + trainings)
    const matchesThisWeek = matches.filter(
      (m) => new Date(m.timestamp) >= weekStart
    ).length
    const trainingsThisWeek = trainings.filter(
      (t) => new Date(t.date) >= weekStart
    ).length
    const eventsThisWeek = matchesThisWeek + trainingsThisWeek

    // Goals this week (sum from player stats)
    const goalsThisWeek = players.reduce((sum, p) => sum + (p.stats.goals || 0), 0)

    // Overall average (simple calculation based on goals and assists)
    const overallAverage = this.calculateOverallAverage(players)

    // Top performers (top 5 players by performance)
    const topPerformers = this.calculateTopPerformers(players)

    // Recent matches (last 5)
    const recentMatches = this.calculateRecentMatches(players, matches)

    // Activity data (last 7 days)
    const activityData = this.calculateActivityData(matches, trainings)

    // Position distribution
    const positionDistribution = this.calculatePositionDistribution(players)

    // Category performance (by position)
    const categoryPerformance = this.calculateCategoryPerformance(players)

    return {
      totalPlayers,
      eventsThisWeek,
      overallAverage,
      goalsThisWeek,
      topPerformers,
      recentMatches,
      activityData,
      positionDistribution,
      categoryPerformance,
    }
  }

  /**
   * Calculate overall average rating from players
   */
  private static calculateOverallAverage(players: Player[]): number {
    if (players.length === 0) return 0

    // Simple formula: (goals * 2 + assists) / matches played, normalized to 0-10
    const totalScore = players.reduce((sum, p) => {
      const score = (p.stats.goals * 2 + p.stats.assists) / Math.max(p.stats.matches, 1)
      return sum + score
    }, 0)

    const average = totalScore / players.length
    return Math.min(10, Math.max(0, average))
  }

  /**
   * Calculate top 5 performers
   */
  private static calculateTopPerformers(players: Player[]): TopPerformer[] {
    const playersWithScore = players.map((p) => {
      const score =
        (p.stats.goals * 3 + p.stats.assists * 2 - p.stats.yellowCards - p.stats.redCards * 3) /
        Math.max(p.stats.matches, 1)

      return {
        id: p.id,
        name: p.name,
        position: p.position,
        average: Math.min(10, Math.max(0, score)),
      }
    })

    return playersWithScore.sort((a, b) => b.average - a.average).slice(0, 5)
  }

  /**
   * Calculate recent matches (mock data for now, as we need matchAthletes join)
   */
  private static calculateRecentMatches(players: Player[], matches: Match[]): RecentMatch[] {
    // For now, return last 5 players with their stats as "recent matches"
    // In a real implementation, we'd join matchAthletes data
    return players.slice(0, 5).map((p) => ({
      id: p.id,
      playerId: p.id,
      playerName: p.name,
      eventType: 'partida' as const,
      date: new Date().toISOString(),
      goals: Math.floor(Math.random() * 3),
      assists: Math.floor(Math.random() * 2),
      rating: Math.random() * 10,
    }))
  }

  /**
   * Calculate activity data for last 7 days
   */
  private static calculateActivityData(matches: Match[], trainings: Training[]): ActivityData {
    const labels: string[] = []
    const matchCounts: number[] = []
    const trainingCounts: number[] = []

    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      // Format label (e.g., "Seg", "Ter")
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
      labels.push(dayNames[date.getDay()])

      // Count matches on this day
      const matchCount = matches.filter((m) => {
        const matchDate = new Date(m.timestamp)
        return matchDate >= date && matchDate < nextDate
      }).length

      // Count trainings on this day
      const trainingCount = trainings.filter((t) => {
        const trainingDate = new Date(t.date)
        return trainingDate >= date && trainingDate < nextDate
      }).length

      matchCounts.push(matchCount)
      trainingCounts.push(trainingCount)
    }

    return {
      labels,
      training: trainingCounts,
      matches: matchCounts,
    }
  }

  /**
   * Calculate position distribution
   */
  private static calculatePositionDistribution(players: Player[]): PositionDistribution[] {
    const positionMap = new Map<string, number>()

    players.forEach((p) => {
      const count = positionMap.get(p.position) || 0
      positionMap.set(p.position, count + 1)
    })

    return Array.from(positionMap.entries()).map(([position, count]) => ({
      position,
      count,
    }))
  }

  /**
   * Calculate category performance (by position)
   */
  private static calculateCategoryPerformance(players: Player[]): CategoryPerformance[] {
    const positionMap = new Map<string, { totalRating: number; count: number }>()

    players.forEach((p) => {
      const rating =
        (p.stats.goals * 3 + p.stats.assists * 2 - p.stats.yellowCards - p.stats.redCards * 3) /
        Math.max(p.stats.matches, 1)

      const current = positionMap.get(p.position) || { totalRating: 0, count: 0 }
      positionMap.set(p.position, {
        totalRating: current.totalRating + Math.min(10, Math.max(0, rating)),
        count: current.count + 1,
      })
    })

    return Array.from(positionMap.entries()).map(([position, data]) => ({
      category: position,
      averageRating: data.totalRating / data.count,
    }))
  }
}
