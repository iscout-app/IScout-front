const API_CONFIG = {
    baseURL: 'http://localhost:3000/api',
    endpoints: {
        auth: {
            login: '/auth/login',
            logout: '/auth/logout'
        },
        players: {
            list: '/players',
            create: '/players',
            getById: '/players/:id',
            update: '/players/:id',
            delete: '/players/:id'
        }
    }
};

export default API_CONFIG;
