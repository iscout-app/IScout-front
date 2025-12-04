export type Role = 'admin' | 'tecnico' | 'olheiro' | 'responsavel'

export const USER_ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrador',
  tecnico: 'Técnico',
  olheiro: 'Olheiro',
  responsavel: 'Responsável',
}

// Authentication types
export interface User {
  id: string
  name: string
  email: string
  role?: Role // Optional - backend doesn't have this field yet
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  success: boolean
  data: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
