export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/sign-in',
    register: '/auth/sign-up',
    // logout: '/auth/logout', // Not available in backend
  },
  // Teams
  teams: {
    list: '/teams',
    create: '/teams',
    getById: (id: string) => `/teams/${id}`,
    update: (id: string) => `/teams/${id}`,
    athletes: (teamId: string) => `/teams/${teamId}/athletes`,
    createAthlete: (teamId: string) => `/teams/${teamId}/athletes`,
    trainings: (teamId: string) => `/teams/${teamId}/trainings`,
  },
  // Athletes (accessed via teams)
  athletes: {
    getById: (id: string) => `/athletes/${id}`,
  },
  // Matches
  matches: {
    list: '/matches',
    create: '/matches',
    getById: (id: string) => `/matches/${id}`,
    update: (id: string) => `/matches/${id}`,
  },
  // Statistics (part of matches)
  stats: {
    create: '/stats', // Placeholder - might not exist
    // list: '/stats', // Not available
    // getByPlayer: (id: string) => `/stats/player/${id}`, // Not available
    // getEvolution: (id: string) => `/stats/player/${id}/evolution`, // Not available
  },
  // Dashboard (aggregated client-side)
  // dashboard: {
  //   summary: '/dashboard', // Not available - aggregated client-side
  // },
} as const
