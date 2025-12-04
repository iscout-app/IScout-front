import { useQuery } from '@tanstack/react-query'
import { historyApi } from '../api/history.api'

export const HISTORY_QUERY_KEY = ['history'] as const

export function usePlayerHistoryQuery(teamId: string | undefined, athleteId: string | undefined) {
  return useQuery({
    queryKey: [...HISTORY_QUERY_KEY, teamId, athleteId],
    queryFn: () => historyApi.getPlayerHistory(teamId!, athleteId!),
    enabled: !!teamId && !!athleteId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
