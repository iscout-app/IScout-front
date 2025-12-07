import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

// Use relative URL for Vite proxy to work (proxy configured in vite.config.ts)
// In production, set VITE_API_URL to the actual API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const apiClient = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api/v1` : '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Token is handled by HTTP-only cookies, but we can add other headers here
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    const isLoginPage = window.location.pathname.includes('/login')

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Don't show toast or redirect if already on login page (failed login attempt)
      if (!isLoginPage) {
        // Show toast before redirect
        toast.error('Sessão expirada. Faça login novamente.')
        // Clear session storage
        sessionStorage.removeItem('auth')
        // Redirect to login
        window.location.href = '/login'
      }
    }

    // Handle 403 Forbidden - redirect to login
    if (error.response?.status === 403) {
      if (!isLoginPage) {
        // Show toast before redirect
        toast.error('Sessão inválida. Faça login novamente.')
        // Clear session storage
        sessionStorage.removeItem('auth')
        // Redirect to login
        window.location.href = '/login'
      }
    }

    // Transform error for better handling
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'Ocorreu um erro inesperado'

    return Promise.reject(new Error(message))
  }
)

export default apiClient
