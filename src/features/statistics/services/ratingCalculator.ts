import type { MatchStatistics } from '../types/statistics.types'

/**
 * Calculate performance rating from match statistics
 * Since backend doesn't store rating, we calculate it client-side
 */
export class RatingCalculator {
  /**
   * Calculate rating based on goals, assists, and cards
   * Formula: (goals * 3 + assists * 2 - yellowCards - redCards * 3)
   * Normalized to 0-10 scale
   */
  static calculate(stats: MatchStatistics): number {
    const baseScore =
      stats.goals * 3 +
      stats.assists * 2 -
      stats.yellowCards -
      stats.redCards * 3

    // Normalize to 0-10 scale
    // Base of 5, each positive point adds 0.5, each negative point subtracts 0.5
    const rating = 5 + baseScore * 0.5

    // Clamp between 0 and 10
    return Math.min(10, Math.max(0, rating))
  }

  /**
   * Get rating color class for UI
   */
  static getRatingColor(rating: number): string {
    if (rating >= 8) return 'text-green-600'
    if (rating >= 6) return 'text-blue-600'
    if (rating >= 4) return 'text-yellow-600'
    return 'text-red-600'
  }

  /**
   * Get rating label
   */
  static getRatingLabel(rating: number): string {
    if (rating >= 9) return 'Excepcional'
    if (rating >= 8) return 'Excelente'
    if (rating >= 7) return 'Muito Bom'
    if (rating >= 6) return 'Bom'
    if (rating >= 5) return 'Regular'
    if (rating >= 4) return 'Abaixo da Média'
    if (rating >= 3) return 'Fraco'
    return 'Muito Fraco'
  }
}
