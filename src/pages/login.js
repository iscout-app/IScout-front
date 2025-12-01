import { setAuthData } from '../utils/auth.js';
import API_CONFIG from '../config/api.js';
import { showToast } from '../components/toast.js';

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showToast.warning('Por favor, preencha todos os campos.');
        return;
    }

    await authenticateUser(email, password);
});

async function authenticateUser(email, password) {
    const submitBtn = loginForm.querySelector('.btn');
    submitBtn.textContent = 'Entrando...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for cookies
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Credenciais inválidas. Verifique email e senha.');
        }

        const data = await response.json();

        if (!data.success || !data.data) {
            throw new Error('Resposta inválida do servidor');
        }

        // Store user data (token is in cookie, managed by browser)
        // Role comes from backend (data.data.role)
        setAuthData('cookie-based-auth', data.data);

        showToast.success(`Login bem-sucedido! Redirecionando...`);

        setTimeout(() => {
            window.location.href = './pages/dashboard.html';
        }, 1000);

    } catch (error) {
        console.error('Login error:', error);
        showToast.error(error.message);
        submitBtn.textContent = 'Entrar';
        submitBtn.disabled = false;
    }
}

document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    showToast.info('Funcionalidade de recuperação de senha será implementada no backend.');
});

console.log('=== CREDENCIAIS DE DEMONSTRAÇÃO ===');
console.log('Técnico: tecnico@iscout.com / tecnico123');
console.log('Olheiro: olheiro@iscout.com / olheiro123');
console.log('Responsável: responsavel@iscout.com / responsavel123');
console.log('Administrador: admin@iscout.com / admin123');
