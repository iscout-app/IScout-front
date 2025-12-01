import API_CONFIG from '../config/api.js';
import { http } from '../utils/http.js';

class PlayerService {
    static async list(filters = {}) {
        const queryParams = new URLSearchParams();

        if (filters.teamId) queryParams.append('teamId', filters.teamId);
        if (filters.position) queryParams.append('position', filters.position);
        if (filters.name) queryParams.append('name', filters.name);

        const queryString = queryParams.toString();
        const endpoint = `${API_CONFIG.endpoints.players.list}${queryString ? '?' + queryString : ''}`;

        return await http.get(endpoint);
    }

    static async getById(id) {
        const endpoint = API_CONFIG.endpoints.players.getById.replace(':id', id);
        return await http.get(endpoint);
    }

    static async create(playerData) {
        return await http.post(API_CONFIG.endpoints.players.create, playerData);
    }

    static async update(id, playerData) {
        const endpoint = API_CONFIG.endpoints.players.update.replace(':id', id);
        return await http.patch(endpoint, playerData);
    }

    static async delete(id, teamId) {
        const endpoint = `${API_CONFIG.endpoints.players.delete.replace(':id', id)}?teamId=${teamId}`;
        return await http.delete(endpoint);
    }
}

export default PlayerService;
