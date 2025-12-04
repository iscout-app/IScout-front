import { type ReactNode, Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { TeamProvider } from '@/features/teams/context/TeamContext'
import { router } from './router'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
})

interface ProvidersProps {
  children?: ReactNode
}

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-4xl">⚽</div>
        <p className="mt-4 text-lg text-muted-foreground">Carregando IScout...</p>
      </div>
    </div>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TeamProvider>
          <Suspense fallback={<LoadingFallback />}>
            {children || <RouterProvider router={router} />}
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                padding: '16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                maxWidth: '400px',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                  color: 'white',
                  border: '2px solid #059669',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#10b981',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#ef4444',
                  color: 'white',
                  border: '2px solid #dc2626',
                },
                iconTheme: {
                  primary: 'white',
                  secondary: '#ef4444',
                },
              },
            }}
          />
        </TeamProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
