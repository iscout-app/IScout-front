import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { statisticsApi } from '../api/statistics.api'
import type { CreateStatisticsDto, StatisticsFilters } from '../types/statistics.types'
import toast from 'react-hot-toast'

export const STATISTICS_QUERY_KEY = ['statistics'] as const

export function useStatisticsQuery(filters?: StatisticsFilters) {
  return useQuery({
    queryKey: filters ? [...STATISTICS_QUERY_KEY, filters] : STATISTICS_QUERY_KEY,
    queryFn: () => statisticsApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePlayerStatisticsQuery(athleteId?: string) {
  return useQuery({
    queryKey: [...STATISTICS_QUERY_KEY, 'player', athleteId],
    queryFn: () => statisticsApi.getByPlayer(athleteId!),
    enabled: !!athleteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePlayerEvolutionQuery(athleteId?: string) {
  return useQuery({
    queryKey: [...STATISTICS_QUERY_KEY, 'evolution', athleteId],
    queryFn: () => statisticsApi.getEvolution(athleteId!),
    enabled: !!athleteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateStatisticsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStatisticsDto) => statisticsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATISTICS_QUERY_KEY })
      toast.success('Estatísticas registradas com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao registrar estatísticas')
    },
  })
}
