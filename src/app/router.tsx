import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { RequirePermission } from '@/features/auth/components/RequirePermission'
import { Layout } from '@/components/layout/Layout'

// Lazy load pages for code splitting
import { lazy } from 'react'

const Login = lazy(() => import('@/features/auth/pages/Login'))
const Register = lazy(() => import('@/features/auth/pages/Register'))
const Dashboard = lazy(() => import('@/features/dashboard/Dashboard'))
const PlayersList = lazy(() => import('@/features/players/pages/PlayersList'))
const StatisticsEntry = lazy(() => import('@/features/statistics/StatisticsEntry'))
const History = lazy(() => import('@/features/history/History'))
const Evolution = lazy(() => import('@/features/evolution/Evolution'))
const Reports = lazy(() => import('@/features/reports/Reports'))
const TeamsList = lazy(() => import('@/features/teams/pages/TeamsList'))
const Users = lazy(() => import('@/features/users/Users'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'players',
        element: (
          <RequirePermission permission="VISUALIZAR_JOGADORES">
            <PlayersList />
          </RequirePermission>
        ),
      },
      {
        path: 'statistics',
        element: (
          <RequirePermission permission="REGISTRAR_ESTATISTICA">
            <StatisticsEntry />
          </RequirePermission>
        ),
      },
      {
        path: 'history',
        element: (
          <RequirePermission permission="VISUALIZAR_HISTORICO">
            <History />
          </RequirePermission>
        ),
      },
      {
        path: 'evolution',
        element: (
          <RequirePermission permission="VISUALIZAR_EVOLUCAO">
            <Evolution />
          </RequirePermission>
        ),
      },
      {
        path: 'reports',
        element: (
          <RequirePermission permission="RELATORIOS_INDIVIDUAIS">
            <Reports />
          </RequirePermission>
        ),
      },
      {
        path: 'teams',
        element: <TeamsList />,
      },
      {
        path: 'users',
        element: (
          <RequirePermission permission="CADASTRAR_USUARIO">
            <Users />
          </RequirePermission>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
