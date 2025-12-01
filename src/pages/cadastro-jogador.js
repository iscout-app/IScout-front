import { requireAuth } from '../utils/auth.js';
import { http } from '../utils/http.js';
import API_CONFIG from '../config/api.js';
import PlayerService from '../services/playerService.js';
import { showToast } from '../components/toast.js';
import { initHeader } from '../components/navbar.js';
import { initPageGuard } from '../utils/rbac.js';

// Verifica autenticação
if (!requireAuth()) {
    // Redireciona para login se não autenticado
}

// Guard: verifica permissão para cadastrar jogadores
initPageGuard('CADASTRAR_JOGADOR');

// Inicializa header com navegação dinâmica
initHeader();

// Load teams
async function loadTeams() {
    try {
        const teams = await http.get(API_CONFIG.endpoints.teams.list);
        const teamSelect = document.getElementById('teamId');
        teamSelect.innerHTML = '<option value="">Selecione um time...</option>';

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.fullName;
            teamSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading teams:', error);
        showToast.error('Erro ao carregar times. Recarregue a página.');
    }
}

// Formulário
const playerForm = document.getElementById('playerForm');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

playerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('nomeCompleto').value.trim(),
        birthdate: document.getElementById('dataNascimento').value,
        teamId: document.getElementById('teamId').value,
        position: document.getElementById('posicao').value,
        shirtNumber: parseInt(document.getElementById('numeroCamisa').value, 10)
    };

    await cadastrarJogador(formData);
});

async function cadastrarJogador(data) {
    const submitBtn = playerForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Cadastrando...';
    submitBtn.disabled = true;

    try {
        const response = await PlayerService.create(data);

        showToast.success('Jogador cadastrado com sucesso!');

        setTimeout(() => {
            playerForm.reset();
        }, 2000);

    } catch (error) {
        console.error('Cadastro error:', error);
        showToast.error(error.message || 'Erro ao cadastrar jogador. Tente novamente.');
    } finally {
        submitBtn.textContent = 'Cadastrar Jogador';
        submitBtn.disabled = false;
    }
}

document.getElementById('cancelBtn').addEventListener('click', () => {
    if (confirm('Deseja realmente cancelar o cadastro?')) {
        playerForm.reset();
    }
});

// Initialize
loadTeams();
