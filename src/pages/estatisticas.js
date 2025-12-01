import { getAuthUser, clearAuthData, requireAuth } from '../utils/auth.js';
import { canRegisterStats } from '../utils/permissions.js';

// Verifica autenticação
if (!requireAuth()) {
    // Redireciona para login se não autenticado
}

// Mostra nome do usuário
const user = getAuthUser();
if (user) {
    document.getElementById('userName').textContent = user.email;
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    clearAuthData();
    window.location.href = '../index.html';
});

// Dados dos jogadores (mock - em produção viria da API)
const mockPlayers = [
    { id: 1, nome: 'João Silva Santos', posicao: 'Meia' },
    { id: 2, nome: 'Pedro Henrique Costa', posicao: 'Atacante' },
    { id: 3, nome: 'Lucas Oliveira', posicao: 'Zagueiro' },
    { id: 4, nome: 'Gabriel Ferreira', posicao: 'Volante' },
    { id: 5, nome: 'Rafael Souza', posicao: 'Goleiro' },
    { id: 6, nome: 'Matheus Lima', posicao: 'Lateral Direito' }
];

// Elementos DOM
const statsForm = document.getElementById('statsForm');
const jogadorSelect = document.getElementById('jogadorSelect');
const tipoEvento = document.getElementById('tipoEvento');
const dataEvento = document.getElementById('dataEvento');
const partidaInfo = document.getElementById('partidaInfo');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Campos de estatísticas
const gols = document.getElementById('gols');
const assistencias = document.getElementById('assistencias');
const passesCertos = document.getElementById('passesCertos');
const passesErrados = document.getElementById('passesErrados');
const precisaoPasse = document.getElementById('precisaoPasse');
const desarmes = document.getElementById('desarmes');
const interceptacoes = document.getElementById('interceptacoes');
const cartoesAmarelos = document.getElementById('cartoesAmarelos');
const cartoesVermelhos = document.getElementById('cartoesVermelhos');

// Resumo
const summaryGolsAssist = document.getElementById('summaryGolsAssist');
const summaryPasses = document.getElementById('summaryPasses');
const summaryDefesa = document.getElementById('summaryDefesa');
const summaryCartoes = document.getElementById('summaryCartoes');

// Popula select de jogadores
mockPlayers.forEach(player => {
    const option = document.createElement('option');
    option.value = player.id;
    option.textContent = `${player.nome} - ${player.posicao}`;
    jogadorSelect.appendChild(option);
});

// Define data de hoje como padrão
dataEvento.valueAsDate = new Date();

// Mostra/esconde informações de partida
tipoEvento.addEventListener('change', () => {
    if (tipoEvento.value === 'partida') {
        partidaInfo.style.display = 'block';
    } else {
        partidaInfo.style.display = 'none';
    }
});

// Calcula precisão de passe automaticamente
function calcularPrecisaoPasse() {
    const certos = parseInt(passesCertos.value) || 0;
    const errados = parseInt(passesErrados.value) || 0;
    const total = certos + errados;
    
    if (total > 0) {
        const precisao = ((certos / total) * 100).toFixed(1);
        precisaoPasse.value = precisao + '%';
    } else {
        precisaoPasse.value = '0%';
    }
    
    atualizarResumo();
}

passesCertos.addEventListener('input', calcularPrecisaoPasse);
passesErrados.addEventListener('input', calcularPrecisaoPasse);

// Atualiza resumo em tempo real
function atualizarResumo() {
    // Gols + Assistências
    const totalGolsAssist = (parseInt(gols.value) || 0) + (parseInt(assistencias.value) || 0);
    summaryGolsAssist.textContent = totalGolsAssist;
    
    // Total de Passes
    const totalPasses = (parseInt(passesCertos.value) || 0) + (parseInt(passesErrados.value) || 0);
    summaryPasses.textContent = totalPasses;
    
    // Ações Defensivas
    const totalDefesa = (parseInt(desarmes.value) || 0) + (parseInt(interceptacoes.value) || 0);
    summaryDefesa.textContent = totalDefesa;
    
    // Cartões
    const amarelos = parseInt(cartoesAmarelos.value) || 0;
    const vermelhos = parseInt(cartoesVermelhos.value) || 0;
    
    if (vermelhos > 0) {
        summaryCartoes.textContent = '🟥 Vermelho';
        summaryCartoes.style.color = 'var(--color-error)';
    } else if (amarelos > 0) {
        summaryCartoes.textContent = `🟨 ${amarelos} Amarelo${amarelos > 1 ? 's' : ''}`;
        summaryCartoes.style.color = '#f59e0b';
    } else {
        summaryCartoes.textContent = 'Limpo ✓';
        summaryCartoes.style.color = 'var(--color-success)';
    }
}

// Adiciona listeners em todos os inputs de estatísticas
const statInputs = document.querySelectorAll('.stat-input');
statInputs.forEach(input => {
    input.addEventListener('input', atualizarResumo);
});

// Adiciona listeners nos cartões também
cartoesAmarelos.addEventListener('input', atualizarResumo);
cartoesVermelhos.addEventListener('input', atualizarResumo);

// Submit do formulário
statsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        jogadorId: parseInt(jogadorSelect.value),
        tipoEvento: tipoEvento.value,
        dataEvento: dataEvento.value,
        duracaoMinutos: parseInt(document.getElementById('duracaoMinutos').value),
        adversario: document.getElementById('adversario').value,
        resultado: document.getElementById('resultado').value,
        
        // Estatísticas ofensivas
        gols: parseInt(gols.value) || 0,
        assistencias: parseInt(assistencias.value) || 0,
        finalizacoes: parseInt(document.getElementById('finalizacoes').value) || 0,
        finalizacoesGol: parseInt(document.getElementById('finalizacoesGol').value) || 0,
        
        // Estatísticas de passe
        passesCertos: parseInt(passesCertos.value) || 0,
        passesErrados: parseInt(passesErrados.value) || 0,
        
        // Estatísticas defensivas
        desarmes: parseInt(desarmes.value) || 0,
        interceptacoes: parseInt(interceptacoes.value) || 0,
        faltasCometidas: parseInt(document.getElementById('faltasCometidas').value) || 0,
        faltasSofridas: parseInt(document.getElementById('faltasSofridas').value) || 0,
        
        // Cartões
        cartoesAmarelos: parseInt(cartoesAmarelos.value) || 0,
        cartoesVermelhos: parseInt(cartoesVermelhos.value) || 0,
        
        // Avaliação
        notaDesempenho: parseFloat(document.getElementById('notaDesempenho').value) || null,
        observacoes: document.getElementById('observacoes').value.trim()
    };

    await registrarEstatisticas(formData);
});

async function registrarEstatisticas(data) {
    const submitBtn = statsForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Registrando...';
    submitBtn.disabled = true;

    try {
        // Em produção, descomente:
        // const response = await http.post(API_CONFIG.endpoints.stats.create, data);
        
        // Simulação
        console.log('Estatísticas registradas:', data);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        hideError();
        showSuccess('Estatísticas registradas com sucesso!');
        
        setTimeout(() => {
            // Limpa o formulário mas mantém jogador e data
            const jogadorAtual = jogadorSelect.value;
            const dataAtual = dataEvento.value;
            
            statsForm.reset();
            
            jogadorSelect.value = jogadorAtual;
            dataEvento.value = dataAtual;
            
            // Reseta valores dos inputs numéricos para 0
            statInputs.forEach(input => input.value = '0');
            gols.value = '0';
            assistencias.value = '0';
            cartoesAmarelos.value = '0';
            cartoesVermelhos.value = '0';
            
            atualizarResumo();
            hideSuccess();
        }, 2000);
        
    } catch (error) {
        showError(error.message || 'Erro ao registrar estatísticas. Tente novamente.');
    } finally {
        submitBtn.textContent = 'Registrar Estatísticas';
        submitBtn.disabled = false;
    }
}

document.getElementById('cancelBtn').addEventListener('click', () => {
    if (confirm('Deseja realmente cancelar o registro?')) {
        window.location.href = './jogadores.html';
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

// Inicializa resumo
atualizarResumo();
