import { ReactNode, Suspense } from 'react'
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
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(var(--success))',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'white',
                },
              },
            }}
          />
        </TeamProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
