import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamsApi } from '../api/teams.api'
import type { CreateTeamDto, UpdateTeamDto } from '../types/team.types'
import toast from 'react-hot-toast'

export const TEAMS_QUERY_KEY = ['teams'] as const

export function useTeamsQuery(enabled = true) {
  return useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: () => teamsApi.getAll(),
    enabled,
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

export function useCreateTeamMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTeamDto) => teamsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY })
      toast.success('Time criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar time')
    },
  })
}

export function useUpdateTeamMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamDto }) =>
      teamsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY })
      toast.success('Time atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar time')
    },
  })
}
