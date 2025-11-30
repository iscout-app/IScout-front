import { getAuthUser, clearAuthData, requireAuth } from '../utils/auth.js';
import { canGenerateIndividualReports, canGenerateCollectiveReports, canRegisterStats, canCadastrarJogador } from '../utils/permissions.js';

// Verifica autenticação
if (!requireAuth()) {
    // Redireciona para login se não autenticado
}

// Mostra nome do usuário e controla navegação
const user = getAuthUser();
if (user) {
    document.getElementById('userName').textContent = user.email;
    
    // Controle de visibilidade dos links de navegação
    const estatisticasLink = document.querySelector('a[href="./estatisticas.html"]');
    const cadastrarLink = document.querySelector('a[href="./cadastro-jogador.html"]');
    
    if (estatisticasLink && !canRegisterStats(user.userType)) {
        estatisticasLink.style.display = 'none';
    }
    
    if (cadastrarLink && !canCadastrarJogador(user.userType)) {
        cadastrarLink.style.display = 'none';
    }
    
    // Verifica se tem permissão para gerar relatórios
    if (!canGenerateIndividualReports(user.userType) && !canGenerateCollectiveReports(user.userType)) {
        alert('Acesso negado! Você não tem permissão para gerar relatórios.');
        window.location.href = './dashboard.html';
    }
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    clearAuthData();
    window.location.href = '../index.html';
});

// Dados mock
const mockPlayers = [
    { id: 1, nome: 'João Silva Santos', posicao: 'Meia', categoria: 'sub-15', dataNascimento: '2010-05-15', altura: 172, peso: 65, emailResponsavel: 'responsavel@iscout.com' },
    { id: 2, nome: 'Pedro Henrique Costa', posicao: 'Atacante', categoria: 'sub-13', dataNascimento: '2012-08-20', altura: 165, peso: 58, emailResponsavel: 'outro@email.com' },
    { id: 3, nome: 'Lucas Oliveira', posicao: 'Zagueiro', categoria: 'sub-17', dataNascimento: '2009-03-10', altura: 180, peso: 75, emailResponsavel: 'responsavel@iscout.com' },
    { id: 4, nome: 'Gabriel Ferreira', posicao: 'Volante', categoria: 'sub-15', dataNascimento: '2011-11-25', altura: 170, peso: 68, emailResponsavel: 'outro2@email.com' },
    { id: 5, nome: 'Rafael Souza', posicao: 'Goleiro', categoria: 'sub-13', dataNascimento: '2013-07-05', altura: 168, peso: 62, emailResponsavel: 'responsavel@iscout.com' },
    { id: 6, nome: 'Matheus Lima', posicao: 'Lateral Direito', categoria: 'sub-15', dataNascimento: '2010-02-14', altura: 175, peso: 70, emailResponsavel: 'outro3@email.com' }
];

// Filtra jogadores baseado no tipo de usuário
function getPlayersForUser() {
    if (!user) return [];
    
    // Responsável vê apenas jogadores que ele é responsável
    if (user.userType === 'responsavel') {
        return mockPlayers.filter(p => p.emailResponsavel === user.email);
    }
    
    // Admin, Técnico e Olheiro veem todos
    return mockPlayers;
}

const availablePlayers = getPlayersForUser();


const mockStats = [
    { id: 1, jogadorId: 1, tipoEvento: 'partida', dataEvento: '2024-11-20', gols: 1, assistencias: 2, passesCertos: 35, passesErrados: 8, notaDesempenho: 8.5 },
    { id: 2, jogadorId: 1, tipoEvento: 'treino', dataEvento: '2024-11-18', gols: 0, assistencias: 0, passesCertos: 42, passesErrados: 5, notaDesempenho: 7.5 },
    { id: 3, jogadorId: 1, tipoEvento: 'partida', dataEvento: '2024-11-15', gols: 0, assistencias: 1, passesCertos: 28, passesErrados: 10, notaDesempenho: 6.5 },
    { id: 4, jogadorId: 3, tipoEvento: 'partida', dataEvento: '2024-11-19', gols: 1, assistencias: 0, passesCertos: 45, passesErrados: 5, notaDesempenho: 9.0 },
    { id: 5, jogadorId: 5, tipoEvento: 'treino', dataEvento: '2024-11-21', gols: 0, assistencias: 0, passesCertos: 15, passesErrados: 3, notaDesempenho: 7.0 }
];

// Elementos DOM
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const jogadorSelect = document.getElementById('jogadorSelect');
const reportPreview = document.getElementById('reportPreview');
const previewContent = document.getElementById('previewContent');
const generateIndividualBtn = document.getElementById('generateIndividualBtn');
const generateColetivoBtn = document.getElementById('generateColetivoBtn');
const progressModal = document.getElementById('progressModal');
const progressTitle = document.getElementById('progressTitle');
const progressMessage = document.getElementById('progressMessage');

// Filtros relatório coletivo
const categoriaFilterColetivo = document.getElementById('categoriaFilterColetivo');
const posicaoFilterColetivo = document.getElementById('posicaoFilterColetivo');
const playersSelection = document.getElementById('playersSelection');
const selectedCount = document.getElementById('selectedCount');

let selectedPlayers = [];
let filteredPlayers = [...availablePlayers];

// Tabs
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    });
});

// Popula select de jogadores
availablePlayers.forEach(player => {
    const option = document.createElement('option');
    option.value = player.id;
    option.textContent = `${player.nome} - ${player.posicao}`;
    jogadorSelect.appendChild(option);
});

// Preview relatório individual
jogadorSelect.addEventListener('change', () => {
    const jogadorId = parseInt(jogadorSelect.value);
    
    if (!jogadorId) {
        reportPreview.style.display = 'none';
        generateIndividualBtn.disabled = true;
        return;
    }
    
    const player = availablePlayers.find(p => p.id === jogadorId);
    const stats = mockStats.filter(s => s.jogadorId === jogadorId);
    
    const totalGols = stats.reduce((sum, s) => sum + (s.gols || 0), 0);
    const totalAssist = stats.reduce((sum, s) => sum + (s.assistencias || 0), 0);
    const mediaNotas = stats.length > 0 
        ? (stats.reduce((sum, s) => sum + s.notaDesempenho, 0) / stats.length).toFixed(1)
        : '0.0';
    
    previewContent.innerHTML = `
        <div class="preview-item"><strong>Jogador:</strong> ${player.nome}</div>
        <div class="preview-item"><strong>Posição:</strong> ${player.posicao}</div>
        <div class="preview-item"><strong>Categoria:</strong> ${player.categoria.toUpperCase()}</div>
        <div class="preview-item"><strong>Total de Eventos:</strong> ${stats.length}</div>
        <div class="preview-item"><strong>Gols:</strong> ${totalGols}</div>
        <div class="preview-item"><strong>Assistências:</strong> ${totalAssist}</div>
        <div class="preview-item"><strong>Média de Desempenho:</strong> ${mediaNotas}</div>
    `;
    
    reportPreview.style.display = 'block';
    generateIndividualBtn.disabled = false;
});

// Gerar relatório individual
generateIndividualBtn.addEventListener('click', async () => {
    const jogadorId = parseInt(jogadorSelect.value);
    const player = availablePlayers.find(p => p.id === jogadorId);
    
    showProgressModal('Gerando Relatório Individual...', `Criando relatório de ${player.nome}`);
    
    // Simula geração de PDF
    await simulateReportGeneration();
    
    hideProgressModal();
    alert(`Relatório individual de ${player.nome} gerado com sucesso!\n\nEm produção, o PDF seria baixado automaticamente.`);
});

// Renderiza lista de jogadores para seleção (coletivo)
function renderPlayersSelection() {
    playersSelection.innerHTML = filteredPlayers.map(player => `
        <div class="player-checkbox-item">
            <input 
                type="checkbox" 
                id="player-${player.id}" 
                value="${player.id}"
                ${selectedPlayers.includes(player.id) ? 'checked' : ''}
            >
            <div class="player-checkbox-info">
                <span class="player-checkbox-name">${player.nome}</span>
                <span class="player-checkbox-meta">${player.posicao} • ${player.categoria.toUpperCase()}</span>
            </div>
        </div>
    `).join('');
    
    // Adiciona eventos aos checkboxes
    playersSelection.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const playerId = parseInt(e.target.value);
            
            if (e.target.checked) {
                if (!selectedPlayers.includes(playerId)) {
                    selectedPlayers.push(playerId);
                }
            } else {
                selectedPlayers = selectedPlayers.filter(id => id !== playerId);
            }
            
            updateSelectedCount();
        });
    });
}

// Atualiza contador de selecionados
function updateSelectedCount() {
    const count = selectedPlayers.length;
    selectedCount.textContent = `${count} jogador${count !== 1 ? 'es' : ''} selecionado${count !== 1 ? 's' : ''}`;
    generateColetivoBtn.disabled = count < 2;
}

// Filtros relatório coletivo
function applyFiltersColetivo() {
    const categoria = categoriaFilterColetivo.value;
    const posicao = posicaoFilterColetivo.value;
    
    filteredPlayers = availablePlayers.filter(player => {
        const matchesCategoria = !categoria || player.categoria === categoria;
        const matchesPosicao = !posicao || player.posicao.toLowerCase().includes(posicao.toLowerCase());
        
        return matchesCategoria && matchesPosicao;
    });
    
    renderPlayersSelection();
}

categoriaFilterColetivo.addEventListener('change', applyFiltersColetivo);
posicaoFilterColetivo.addEventListener('change', applyFiltersColetivo);

// Gerar relatório coletivo
generateColetivoBtn.addEventListener('click', async () => {
    if (selectedPlayers.length < 2) {
        alert('Selecione pelo menos 2 jogadores para o relatório coletivo.');
        return;
    }
    
    showProgressModal('Gerando Relatório Coletivo...', `Comparando ${selectedPlayers.length} jogadores`);
    
    // Simula geração de PDF
    await simulateReportGeneration();
    
    hideProgressModal();
    alert(`Relatório coletivo de ${selectedPlayers.length} jogadores gerado com sucesso!\n\nEm produção, o PDF seria baixado automaticamente.`);
});

// Modal de progresso
function showProgressModal(title, message) {
    progressTitle.textContent = title;
    progressMessage.textContent = message;
    progressModal.style.display = 'block';
}

function hideProgressModal() {
    progressModal.style.display = 'none';
}

// Simula geração de relatório
function simulateReportGeneration() {
    return new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
}

// Inicializa
renderPlayersSelection();
updateSelectedCount();
