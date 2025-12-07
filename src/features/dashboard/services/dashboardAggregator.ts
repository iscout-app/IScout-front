import type {
  DashboardSummary,
  TopPerformer,
  RecentMatch,
  ActivityData,
  PositionDistribution,
  CategoryPerformance,
} from '../types/dashboard.types'
import type { Player } from '@/features/players/types/player.types'
import type { MatchWithAthletes } from '@/features/matches/api/matches.api'
import type { Training } from '@/features/trainings/api/trainings.api'
import { calculateRating } from '@/features/statistics/services/ratingCalculator'

/**
 * Aggregate dashboard data from multiple API calls
 */
export class DashboardAggregator {
  /**
   * Calculate dashboard summary from players, matches, and trainings
   */
  static aggregate(
    players: Player[],
    matches: MatchWithAthletes[],
    trainings: Training[]
  ): DashboardSummary {
    const now = new Date()
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
    // Filter only players with matches played
    const playersWithMatches = players.filter(p => p.stats.matches > 0)

    if (playersWithMatches.length === 0) return 0

    // Simple formula: (goals * 2 + assists) / matches played, normalized to 0-10
    const totalScore = playersWithMatches.reduce((sum, p) => {
      const score = (p.stats.goals * 2 + p.stats.assists) / p.stats.matches
      return sum + score
    }, 0)

    const average = totalScore / playersWithMatches.length
    return Math.min(10, Math.max(0, average))
  }

  /**
   * Calculate top 5 performers
   */
  private static calculateTopPerformers(players: Player[]): TopPerformer[] {
    // Filter only players with matches played
    const playersWithMatches = players.filter(p => p.stats.matches > 0)

    const playersWithScore = playersWithMatches.map((p) => {
      // Calculate rating per match using the unified formula
      const goalsPerMatch = p.stats.goals / p.stats.matches
      const assistsPerMatch = p.stats.assists / p.stats.matches
      const yellowCardsPerMatch = p.stats.yellowCards / p.stats.matches
      const redCardsPerMatch = p.stats.redCards / p.stats.matches

      const average = calculateRating(
        goalsPerMatch,
        assistsPerMatch,
        yellowCardsPerMatch,
        redCardsPerMatch
      )

      return {
        id: p.id,
        name: p.name,
        position: p.position,
        average,
      }
    })

    return playersWithScore.sort((a, b) => b.average - a.average).slice(0, 5)
  }

  /**
   * Calculate recent matches from match data with athlete performances
   */
  private static calculateRecentMatches(players: Player[], matches: MatchWithAthletes[]): RecentMatch[] {
    const recentMatches: RecentMatch[] = []

    // Get last 10 matches (we'll show 10 most recent records)
    const sortedMatches = [...matches].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10)

    // For each match, create a RecentMatch entry for each athlete
    sortedMatches.forEach((match) => {
      if (!match.athletes || match.athletes.length === 0) return

      match.athletes.forEach((athletePerformance) => {
        // Find player name - try from athlete nested object first, then from players array
        let playerName = athletePerformance.athlete?.name
        if (!playerName) {
          const player = players.find(p => p.id === athletePerformance.athleteId)
          playerName = player?.name || 'Jogador Desconhecido'
        }

        // Calculate rating using the unified formula
        const rating = calculateRating(
          athletePerformance.goals,
          athletePerformance.assists,
          athletePerformance.yellowCards,
          athletePerformance.redCards
        )

        recentMatches.push({
          id: `${match.id}-${athletePerformance.athleteId}`,
          playerId: athletePerformance.athleteId,
          playerName,
          eventType: 'partida',
          date: match.timestamp,
          goals: athletePerformance.goals,
          assists: athletePerformance.assists,
          rating,
        })
      })
    })

    // Sort by date (most recent first) and limit to 10
    return recentMatches
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  }

  /**
   * Calculate activity data for last 7 days
   */
  private static calculateActivityData(matches: MatchWithAthletes[], trainings: Training[]): ActivityData {
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
        matchDate.setHours(0, 0, 0, 0) // Normalize to midnight local time
        return matchDate >= date && matchDate < nextDate
      }).length

      // Count trainings on this day
      const trainingCount = trainings.filter((t) => {
        // Parse date string as local date (YYYY-MM-DD)
        const [year, month, day] = t.date.split('-').map(Number)
        const trainingDate = new Date(year, month - 1, day) // month is 0-indexed
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

    // Filter only players with matches played
    const playersWithMatches = players.filter(p => p.stats.matches > 0)

    playersWithMatches.forEach((p) => {
      // Calculate rating per match using the unified formula
      const goalsPerMatch = p.stats.goals / p.stats.matches
      const assistsPerMatch = p.stats.assists / p.stats.matches
      const yellowCardsPerMatch = p.stats.yellowCards / p.stats.matches
      const redCardsPerMatch = p.stats.redCards / p.stats.matches

      const rating = calculateRating(
        goalsPerMatch,
        assistsPerMatch,
        yellowCardsPerMatch,
        redCardsPerMatch
      )

      const current = positionMap.get(p.position) || { totalRating: 0, count: 0 }
      positionMap.set(p.position, {
        totalRating: current.totalRating + rating,
        count: current.count + 1,
      })
    })

    return Array.from(positionMap.entries()).map(([position, data]) => ({
      category: position,
      averageRating: data.totalRating / data.count,
    }))
  }
}
