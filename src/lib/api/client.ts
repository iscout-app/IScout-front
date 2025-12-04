import axios, { AxiosError } from 'axios'

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
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Clear session storage
      sessionStorage.removeItem('auth')
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    // Transform error for better handling
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'An error occurred'

    return Promise.reject(new Error(message))
  }
)

export default apiClient
