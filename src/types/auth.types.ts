export type Role = 'admin' | 'tecnico' | 'olheiro' | 'responsavel'

// Authentication types
export interface User {
  id: string
  name: string
  email: string
  role: Role
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

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
