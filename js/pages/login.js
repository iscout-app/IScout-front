import { setAuthData } from '../utils/auth.js';

const userTypeBtns = document.querySelectorAll('.user-type-btn');

userTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        userTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const radio = btn.querySelector('input[type="radio"]');
        radio.checked = true;
    });
});

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const userType = document.querySelector('input[name="userType"]:checked').value;

    if (!email || !password) {
        showError('Por favor, preencha todos os campos.');
        return;
    }

    await authenticateUser(email, password, userType);
});

async function authenticateUser(email, password, userType) {
    const submitBtn = loginForm.querySelector('.btn');
    submitBtn.textContent = 'Entrando...';
    submitBtn.disabled = true;

    try {
        const demoCredentials = {
            'tecnico@iscout.com': { password: 'tecnico123', type: 'tecnico' },
            'olheiro@iscout.com': { password: 'olheiro123', type: 'olheiro' },
            'responsavel@iscout.com': { password: 'responsavel123', type: 'responsavel' },
            'admin@iscout.com': { password: 'admin123', type: 'admin' }
        };

        const user = demoCredentials[email];

        if (user && user.password === password && user.type === userType) {
            const authData = {
                token: 'demo-jwt-token-' + Date.now(),
                user: { email, userType }
            };

            setAuthData(authData.token, authData.user);
            hideError();

            console.log('Login bem-sucedido! Redirecionando...');

            setTimeout(() => {
                window.location.href = './pages/dashboard.html';
            }, 500);

        } else {
            throw new Error('Credenciais inválidas ou tipo de usuário incorreto.');
        }
    } catch (error) {
        showError(error.message);
        submitBtn.textContent = 'Entrar';
        submitBtn.disabled = false;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => hideError(), 5000);
}

function hideError() {
    errorMessage.classList.remove('show');
}

document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Funcionalidade de recuperação de senha será implementada no backend.');
});

console.log('=== CREDENCIAIS DE DEMONSTRAÇÃO ===');
console.log('Técnico: tecnico@iscout.com / tecnico123');
console.log('Olheiro: olheiro@iscout.com / olheiro123');
console.log('Responsável: responsavel@iscout.com / responsavel123');
console.log('Administrador: admin@iscout.com / admin123');
