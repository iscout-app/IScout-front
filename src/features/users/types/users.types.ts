export type UserRole = 'admin' | 'tecnico' | 'olheiro' | 'responsavel'

export type UserStatus = 'active' | 'inactive'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  role: UserRole
  status?: UserStatus
  phone?: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
  role?: UserRole
  status?: UserStatus
  phone?: string
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  tecnico: 'Técnico',
  olheiro: 'Olheiro',
  responsavel: 'Responsável',
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
}
