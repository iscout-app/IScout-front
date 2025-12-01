import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType, LoginCredentials } from '@/types/auth.types'
import { authApi } from '../api/authApi'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

const AUTH_STORAGE_KEY = 'auth'

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from sessionStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const authData = sessionStorage.getItem(AUTH_STORAGE_KEY)
        if (authData) {
          const { user: storedUser, expiresAt } = JSON.parse(authData)

          // Check if session expired
          if (expiresAt && new Date(expiresAt) > new Date()) {
            setUser(storedUser)
          } else {
            sessionStorage.removeItem(AUTH_STORAGE_KEY)
          }
        }
      } catch (error) {
        console.error('Error loading auth data:', error)
        sessionStorage.removeItem(AUTH_STORAGE_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials)

      // Store user data in state and sessionStorage
      setUser(response.user)

      // Calculate expiration (e.g., 24 hours from now)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: response.user,
          expiresAt: expiresAt.toISOString(),
        })
      )
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)

    // Optionally call logout endpoint
    authApi.logout().catch(console.error)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
