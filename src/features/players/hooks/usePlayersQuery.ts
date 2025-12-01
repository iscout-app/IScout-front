import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { playersApi } from '../api/playersApi'
import { CreatePlayerDto, UpdatePlayerDto, Player } from '../types/player.types'
import toast from 'react-hot-toast'

export const PLAYERS_QUERY_KEY = ['players'] as const

export function usePlayersQuery() {
  return useQuery({
    queryKey: PLAYERS_QUERY_KEY,
    queryFn: () => playersApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePlayerQuery(id: string) {
  return useQuery({
    queryKey: [...PLAYERS_QUERY_KEY, id],
    queryFn: () => playersApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreatePlayerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlayerDto) => playersApi.create(data),
    onSuccess: (newPlayer) => {
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
    mutationFn: ({ id, data }: { id: string; data: UpdatePlayerDto }) =>
      playersApi.update(id, data),
    onSuccess: (updatedPlayer) => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...PLAYERS_QUERY_KEY, updatedPlayer.id] })
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
    mutationFn: (id: string) => playersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEY })
      toast.success('Jogador removido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover jogador')
    },
  })
}
