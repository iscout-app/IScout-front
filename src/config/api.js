const API_CONFIG = {
    baseURL: 'http://localhost:3000/v1',
    endpoints: {
        auth: {
            login: '/auth/sign-in',
            register: '/auth/sign-up',
            logout: '/auth/logout'
        },
        players: {
            list: '/players',
            create: '/players',
            getById: '/players/:id',
            update: '/players/:id',
            delete: '/players/:id'
        },
        stats: {
            create: '/stats',
            list: '/stats',
            getByPlayer: '/stats/player/:id',
            getEvolution: '/stats/player/:id/evolution'
        },
        dashboard: {
            summary: '/dashboard'
        },
        teams: {
            list: '/teams',
            create: '/teams',
            getById: '/teams/:id'
        }
    }
};

export default API_CONFIG;
