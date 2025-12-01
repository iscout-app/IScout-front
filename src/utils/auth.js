// Usando sessionStorage para desenvolvimento local
// Em produção com sandbox, o backend gerenciará sessões via cookies HTTP-only

export function setAuthData(token, user, expiresIn = 3600000) {
    const authData = {
        token,
        user,
        expiresAt: Date.now() + expiresIn
    };
    sessionStorage.setItem('authData', JSON.stringify(authData));
}

export function getAuthToken() {
    const authData = getStoredAuthData();
    if (!authData) return null;
    
    if (authData.expiresAt && Date.now() > authData.expiresAt) {
        clearAuthData();
        return null;
    }
    return authData.token;
}

export function getAuthUser() {
    const authData = getStoredAuthData();
    return authData ? authData.user : null;
}

export function isAuthenticated() {
    return !!getAuthToken();
}

export function clearAuthData() {
    sessionStorage.removeItem('authData');
}

export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

function getStoredAuthData() {
    try {
        const data = sessionStorage.getItem('authData');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        return null;
    }
}
