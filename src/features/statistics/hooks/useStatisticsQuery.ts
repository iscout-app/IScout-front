import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const STATISTICS_QUERY_KEY = ['statistics'] as const

// These hooks are placeholder for future use
// The actual statistics registration is done through trainingsApi and matchesApi

export function useCreateTrainingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      // This is handled in StatisticsEntry.tsx directly
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATISTICS_QUERY_KEY })
      toast.success('Treino registrado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao registrar treino')
    },
  })
}

export function useCreateMatchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      // This is handled in StatisticsEntry.tsx directly
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATISTICS_QUERY_KEY })
      toast.success('Partida registrada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao registrar partida')
    },
  })
}
