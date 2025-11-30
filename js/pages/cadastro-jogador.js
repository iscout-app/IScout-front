import { getAuthUser, clearAuthData, requireAuth } from '../utils/auth.js';
import { http } from '../utils/http.js';
import API_CONFIG from '../config/api.js';

// Verifica autenticação
if (!requireAuth()) {
    // Redireciona para login se não autenticado
}

// Mostra nome do usuário
const user = getAuthUser();
if (user) {
    document.getElementById('userName').textContent = user.email;
    
    // Controle de visibilidade do link de Estatísticas
    const estatisticasLink = document.querySelector('a[href="./estatisticas.html"]');
    if (estatisticasLink && !canRegisterStats(user.userType)) {
        estatisticasLink.style.display = 'none';
    }
    
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    clearAuthData();
    window.location.href = '/index.html';
});

// Máscaras de input
const cpfInput = document.getElementById('cpf');
const telefoneInput = document.getElementById('telefone');
const telefoneResponsavelInput = document.getElementById('telefoneResponsavel');

cpfInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    }
});

function applyPhoneMask(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        }
    });
}

applyPhoneMask(telefoneInput);
applyPhoneMask(telefoneResponsavelInput);

// Formulário
const playerForm = document.getElementById('playerForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

playerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        nomeCompleto: document.getElementById('nomeCompleto').value.trim(),
        dataNascimento: document.getElementById('dataNascimento').value,
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        email: document.getElementById('email').value.trim(),
        telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
        nomeResponsavel: document.getElementById('nomeResponsavel').value.trim(),
        emailResponsavel: document.getElementById('emailResponsavel').value.trim(),
        telefoneResponsavel: document.getElementById('telefoneResponsavel').value.replace(/\D/g, ''),
        altura: parseFloat(document.getElementById('altura').value),
        peso: parseFloat(document.getElementById('peso').value),
        pePreferido: document.getElementById('pePreferido').value,
        posicao: document.getElementById('posicao').value,
        categoria: document.getElementById('categoria').value,
        escolaOrigem: document.getElementById('escolaOrigem').value.trim(),
        observacoes: document.getElementById('observacoes').value.trim()
    };

    await cadastrarJogador(formData);
});

async function cadastrarJogador(data) {
    const submitBtn = playerForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Cadastrando...';
    submitBtn.disabled = true;

    try {
        // Em produção, descomente:
        // const response = await http.post(API_CONFIG.endpoints.players.create, data);
        
        // Simulação
        console.log('Dados do jogador:', data);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        hideError();
        showSuccess('Jogador cadastrado com sucesso!');
        
        setTimeout(() => {
            playerForm.reset();
            hideSuccess();
        }, 3000);
        
    } catch (error) {
        showError(error.message || 'Erro ao cadastrar jogador. Tente novamente.');
    } finally {
        submitBtn.textContent = 'Cadastrar Jogador';
        submitBtn.disabled = false;
    }
}

document.getElementById('cancelBtn').addEventListener('click', () => {
    if (confirm('Deseja realmente cancelar o cadastro?')) {
        playerForm.reset();
        hideError();
        hideSuccess();
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => hideError(), 5000);
}

function hideError() {
    errorMessage.classList.remove('show');
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add('show');
}

function hideSuccess() {
    successMessage.classList.remove('show');
}
