import { Player, PlayerFilters } from '../types/player.types'
import type { User } from '@/types/auth.types'

export function filterPlayersByRole(players: Player[], user: User | null): Player[] {
  if (!user) return []

  // Admin, tecnico, and olheiro can see all players
  if (user.role === 'admin' || user.role === 'tecnico' || user.role === 'olheiro') {
    return players
  }

  // Responsavel can only see their own players
  if (user.role === 'responsavel') {
    return players.filter((player) => player.emailResponsavel === user.email)
  }

  return []
}

export function applyFilters(players: Player[], filters: PlayerFilters): Player[] {
  let filtered = players

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (player) =>
        player.name.toLowerCase().includes(search) ||
        player.position.toLowerCase().includes(search) ||
        player.category.toLowerCase().includes(search)
    )
  }

  if (filters.position) {
    filtered = filtered.filter((player) => player.position === filters.position)
  }

  if (filters.category) {
    filtered = filtered.filter((player) => player.category === filters.category)
  }

  if (filters.emailResponsavel) {
    filtered = filtered.filter((player) => player.emailResponsavel === filters.emailResponsavel)
  }

  return filtered
}

export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}
