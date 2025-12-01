export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/sign-in',
    logout: '/auth/logout',
    register: '/auth/sign-up',
  },
  // Players
  players: {
    list: '/players',
    create: '/players',
    getById: (id: string) => `/players/${id}`,
    update: (id: string) => `/players/${id}`,
    delete: (id: string) => `/players/${id}`,
  },
  // Statistics
  stats: {
    list: '/stats',
    create: '/stats',
    getByPlayer: (id: string) => `/stats/player/${id}`,
    getEvolution: (id: string) => `/stats/player/${id}/evolution`,
  },
  // Dashboard
  dashboard: {
    summary: '/dashboard',
  },
  // Teams
  teams: {
    list: '/teams',
    create: '/teams',
    getById: (id: string) => `/teams/${id}`,
  },
} as const
