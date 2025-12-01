import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { playersApi, type CreatePlayerDto, type UpdatePlayerDto } from '../api/players.api'
import toast from 'react-hot-toast'

export const PLAYERS_QUERY_KEY = ['players'] as const

export function usePlayersQuery(teamId?: string) {
  return useQuery({
    queryKey: teamId ? [...PLAYERS_QUERY_KEY, teamId] : PLAYERS_QUERY_KEY,
    queryFn: () => playersApi.getAll(teamId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePlayerQuery(id: string, teamId?: string) {
  return useQuery({
    queryKey: [...PLAYERS_QUERY_KEY, id, teamId],
    queryFn: () => playersApi.getById(id, teamId),
    enabled: !!id,
    staleTime: 0, // Sempre refetch para garantir dados atualizados
    retry: 1, // Tentar apenas uma vez em caso de erro
  })
}

export function useCreatePlayerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlayerDto) => playersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEY })
      toast.success('Jogador cadastrado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao cadastrar jogador')
    },
  })
}

export function useUpdatePlayerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, teamId, data }: { id: string; teamId: string; data: UpdatePlayerDto }) =>
      playersApi.update(id, teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEY })
      toast.success('Jogador atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar jogador')
    },
  })
}

export function useDeletePlayerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, teamId }: { id: string; teamId: string }) =>
      playersApi.delete(id, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEY })
      toast.success('Jogador removido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover jogador')
    },
  })
}
