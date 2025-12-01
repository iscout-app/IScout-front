import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { statsApi } from '../api/statsApi'
import { CreateStatDto, UpdateStatDto } from '../types/stat.types'
import toast from 'react-hot-toast'

export const STATS_QUERY_KEY = ['stats'] as const

export function useStatsQuery() {
  return useQuery({
    queryKey: STATS_QUERY_KEY,
    queryFn: () => statsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useStatQuery(id: string) {
  return useQuery({
    queryKey: [...STATS_QUERY_KEY, id],
    queryFn: () => statsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePlayerStatsQuery(playerId: string) {
  return useQuery({
    queryKey: [...STATS_QUERY_KEY, 'player', playerId],
    queryFn: () => statsApi.getByPlayerId(playerId),
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateStatMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStatDto) => statsApi.create(data),
    onSuccess: (newStat) => {
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Estatística registrada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao registrar estatística')
    },
  })
}

export function useUpdateStatMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatDto }) =>
      statsApi.update(id, data),
    onSuccess: (updatedStat) => {
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Estatística atualizada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar estatística')
    },
  })
}

export function useDeleteStatMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => statsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Estatística removida com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover estatística')
    },
  })
}
