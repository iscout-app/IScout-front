import type { MatchStatistic, PlayerReportData } from '../types/reports.types'
import type { Player } from '@/features/players/types/player.types'

/**
 * Aggregates match statistics to create a comprehensive player report
 */
export function aggregatePlayerReport(
  player: Player,
  stats: MatchStatistic[]
): PlayerReportData {
  const totalMatches = stats.length

  // Calculate totals
  const totalGoals = stats.reduce((sum, s) => sum + s.goals, 0)
  const totalAssists = stats.reduce((sum, s) => sum + s.assists, 0)
  const totalYellowCards = stats.reduce((sum, s) => sum + s.yellowCards, 0)
  const totalRedCards = stats.reduce((sum, s) => sum + s.redCards, 0)

  // Calculate averages
  const ratings = stats.filter((s) => s.performanceRating !== undefined && s.performanceRating !== null)
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, s) => sum + (s.performanceRating || 0), 0) / ratings.length // Already in 0-10 scale
    : 0

  const goalsPerMatch = totalMatches > 0 ? totalGoals / totalMatches : 0
  const assistsPerMatch = totalMatches > 0 ? totalAssists / totalMatches : 0

  // Calculate pass accuracy
  const totalAccuratePasses = stats.reduce((sum, s) => sum + s.accuratePasses, 0)
  const totalInaccuratePasses = stats.reduce((sum, s) => sum + s.inaccuratePasses, 0)
  const totalPasses = totalAccuratePasses + totalInaccuratePasses
  const passAccuracy = totalPasses > 0 ? (totalAccuratePasses / totalPasses) * 100 : 0

  // Calculate defensive metrics
  const totalTackles = stats.reduce((sum, s) => sum + s.tackles, 0)
  const totalInterceptions = stats.reduce((sum, s) => sum + s.interceptions, 0)
  const tacklesPerMatch = totalMatches > 0 ? totalTackles / totalMatches : 0
  const interceptionsPerMatch = totalMatches > 0 ? totalInterceptions / totalMatches : 0

  // Create evolution data (sorted by date)
  const evolution = stats
    .map((s) => ({
      date: s.matchDate,
      goals: s.goals,
      assists: s.assists,
      rating: s.performanceRating || 0, // Already in 0-10 scale
      yellowCards: s.yellowCards,
      redCards: s.redCards,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return {
    id: player.id,
    name: player.name,
    position: player.position,
    birthdate: player.birthdate,
    shirtNumber: player.shirtNumber,
    teamId: player.teamId || '',

    totalMatches,
    totalGoals,
    totalAssists,
    totalYellowCards,
    totalRedCards,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal

    goalsPerMatch: Math.round(goalsPerMatch * 100) / 100,
    assistsPerMatch: Math.round(assistsPerMatch * 100) / 100,
    passAccuracy: Math.round(passAccuracy * 10) / 10,
    tacklesPerMatch: Math.round(tacklesPerMatch * 100) / 100,
    interceptionsPerMatch: Math.round(interceptionsPerMatch * 100) / 100,

    evolution,
  }
}

/**
 * Calculate age from birthdate
 */
export function calculateAge(birthdate: string): number {
  const today = new Date()
  const birth = new Date(birthdate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

/**
 * Format number with decimal places
 */
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals)
}

/**
 * Format date to Brazilian format
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}
