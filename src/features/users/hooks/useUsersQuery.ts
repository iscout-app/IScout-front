import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users.api'
import type { CreateUserDto } from '../types/users.types'
import toast from 'react-hot-toast'

export const USERS_QUERY_KEY = ['users'] as const

/**
 * Hook to fetch all users
 * Note: Currently returns empty array as backend doesn't have list endpoint
 */
export function useUsersQuery() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => usersApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single user by ID
 */
export function useUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, id] as const,
    queryFn: () => (id ? usersApi.getById(id) : null),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to create a new user
 */
export function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDto) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      toast.success('Usuário criado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar usuário')
    },
  })
}

/**
 * Hook to update a user
 * Note: Currently not functional as backend doesn't have update endpoint
 */
export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateUserDto> }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      toast.success('Usuário atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar usuário')
    },
  })
}

/**
 * Hook to delete a user
 * Note: Currently not functional as backend doesn't have delete endpoint
 */
export function useDeleteUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      toast.success('Usuário removido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover usuário')
    },
  })
}
