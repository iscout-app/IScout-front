export type Role = 'admin' | 'tecnico' | 'olheiro' | 'responsavel'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  user: User
  token?: string
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
