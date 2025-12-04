import { useQuery } from '@tanstack/react-query'
import { teamsApi } from '../api/teams.api'

export const TEAMS_QUERY_KEY = ['teams'] as const

export function useTeamsQuery() {
  return useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: () => teamsApi.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useTeamQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...TEAMS_QUERY_KEY, id],
    queryFn: () => teamsApi.getById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}
