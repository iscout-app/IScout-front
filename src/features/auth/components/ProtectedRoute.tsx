import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTeamsQuery } from '@/features/teams/hooks/useTeamsQuery'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: teams, isLoading: teamsLoading } = useTeamsQuery()
  const location = useLocation()

  // Show loading while checking authentication or teams
  if (authLoading || teamsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">⚽</div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user has at least one team
  const hasTeams = teams && teams.length > 0

  // If user doesn't have teams and is not already on the teams page, redirect to teams
  if (!hasTeams && location.pathname !== '/teams') {
    return <Navigate to="/teams" replace />
  }

  return <>{children}</>
}
