import API_CONFIG from '../config/api.js';
import { getAuthToken, clearAuthData } from './auth.js';

export async function httpRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include' // Important for cookie-based auth
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle 401 Unauthorized - redirect to login
            if (response.status === 401) {
                clearAuthData();
                window.location.href = '/index.html';
                throw new Error('Sessão expirada. Faça login novamente.');
            }

            throw new Error(data.message || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('HTTP Error:', error);
        throw error;
    }
}

export const http = {
    get: (endpoint, options) => httpRequest(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => httpRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    patch: (endpoint, body, options) => httpRequest(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => httpRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => httpRequest(endpoint, { ...options, method: 'DELETE' })
};
