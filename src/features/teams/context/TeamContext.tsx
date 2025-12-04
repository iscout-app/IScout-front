import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Team } from '../types/team.types'
import { useTeamsQuery } from '../hooks/useTeamsQuery'
import { useAuth } from '@/features/auth/context/AuthContext'

interface TeamContextType {
  currentTeam: Team | null
  teams: Team[]
  isLoading: boolean
  setCurrentTeam: (team: Team | null) => void
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

interface TeamProviderProps {
  children: ReactNode
}

const TEAM_STORAGE_KEY = 'currentTeam'

export function TeamProvider({ children }: TeamProviderProps) {
  const { isAuthenticated } = useAuth()
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(null)

  const { data: teams = [], isLoading } = useTeamsQuery(isAuthenticated)

  // Load team from localStorage on mount and when teams are fetched
  useEffect(() => {
    if (teams.length === 0) return

    try {
      const storedTeamId = localStorage.getItem(TEAM_STORAGE_KEY)

      if (storedTeamId) {
        const team = teams.find((t) => t.id === storedTeamId)
        if (team) {
          setCurrentTeamState(team)
          return
        }
      }

      // If no stored team or not found, use first team
      if (teams.length > 0 && !currentTeam) {
        setCurrentTeamState(teams[0])
        localStorage.setItem(TEAM_STORAGE_KEY, teams[0].id)
      }
    } catch (error) {
      console.error('Error loading team data:', error)
      if (teams.length > 0) {
        setCurrentTeamState(teams[0])
      }
    }
  }, [teams, currentTeam])

  // Clear team when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentTeamState(null)
      localStorage.removeItem(TEAM_STORAGE_KEY)
    }
  }, [isAuthenticated])

  const setCurrentTeam = (team: Team | null) => {
    setCurrentTeamState(team)
    if (team) {
      localStorage.setItem(TEAM_STORAGE_KEY, team.id)
    } else {
      localStorage.removeItem(TEAM_STORAGE_KEY)
    }
  }

  const value: TeamContextType = {
    currentTeam,
    teams,
    isLoading,
    setCurrentTeam,
  }

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider')
  }
  return context
}
