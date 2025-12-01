import API_CONFIG from '../config/api.js';
import { http } from '../utils/http.js';

class StatsService {
    static async create(statsData) {
        return await http.post(API_CONFIG.endpoints.stats.create, statsData);
    }

    static async list(filters = {}) {
        const queryParams = new URLSearchParams();

        if (filters.athleteId) queryParams.append('athleteId', filters.athleteId);
        if (filters.matchId) queryParams.append('matchId', filters.matchId);
        if (filters.teamId) queryParams.append('teamId', filters.teamId);

        const queryString = queryParams.toString();
        const endpoint = `${API_CONFIG.endpoints.stats.list}${queryString ? '?' + queryString : ''}`;

        return await http.get(endpoint);
    }

    static async getByPlayer(playerId) {
        const endpoint = API_CONFIG.endpoints.stats.getByPlayer.replace(':id', playerId);
        return await http.get(endpoint);
    }

    static async getEvolution(playerId) {
        const endpoint = API_CONFIG.endpoints.stats.getEvolution.replace(':id', playerId);
        return await http.get(endpoint);
    }
}

export default StatsService;
