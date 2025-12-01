import { getAuthUser, clearAuthData, requireAuth } from '../utils/auth.js';
import { canViewHistorico, canRegisterStats, canCadastrarJogador } from '../utils/permissions.js';
import { http } from '../utils/http.js';
import API_CONFIG from '../config/api.js';
import PlayerService from '../services/playerService.js';
import StatsService from '../services/statsService.js';

// Verifica autenticação
if (!requireAuth()) {
    // Redireciona para login se não autenticado
}

// Mostra nome do usuário e controla navegação
const user = getAuthUser();
if (user) {
    document.getElementById('userName').textContent = user.name || user.email;
    
    // Controle de visibilidade dos links de navegação
    const estatisticasLink = document.querySelector('a[href="./estatisticas.html"]');
    const cadastrarLink = document.querySelector('a[href="./cadastro-jogador.html"]');
    
    if (estatisticasLink && !canRegisterStats(user.userType)) {
        estatisticasLink.style.display = 'none';
    }
    
    if (cadastrarLink && !canCadastrarJogador(user.userType)) {
        cadastrarLink.style.display = 'none';
    }
    
    // Verifica se tem permissão para visualizar histórico
    if (!canViewHistorico(user.userType)) {
        alert('Acesso negado! Você não tem permissão para visualizar o histórico.');
        window.location.href = './jogadores.html';
    }
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.logout}`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    clearAuthData();
    window.location.href = '../index.html';
});

// Data from API
let allPlayers = [];
let playerStats = {};

// Load players from API
async function loadPlayers() {
    try {
        allPlayers = await PlayerService.list();
        return allPlayers;
    } catch (error) {
        console.error('Error loading players:', error);
        return [];
    }
}

// Load stats for player from API
async function loadPlayerStats(playerId) {
    try {
        const stats = await StatsService.getByPlayer(playerId);
        playerStats[playerId] = stats;
        return stats;
    } catch (error) {
        console.error('Error loading player stats:', error);
        return [];
    }
}

let
        passesCertos: 35,
        passesErrados: 8,
        desarmes: 3,
        interceptacoes: 2,
        faltasCometidas: 1,
        faltasSofridas: 3,
        cartoesAmarelos: 0,
        cartoesVermelhos: 0,
        notaDesempenho: 8.5,
        observacoes: 'Excelente desempenho, criou várias oportunidades de gol.'
    },
    {
        id: 2,
        jogadorId: 1,
        tipoEvento: 'treino',
        dataEvento: '2024-11-18',
        duracaoMinutos: 60,
        gols: 0,
        assistencias: 0,
        passesCertos: 42,
        passesErrados: 5,
        desarmes: 5,
        interceptacoes: 3,
        faltasCometidas: 0,
        cartoesAmarelos: 0,
        cartoesVermelhos: 0,
        notaDesempenho: 7.5,
        observacoes: 'Bom treino técnico, melhorou precisão dos passes.'
    },
    {
        id: 3,
        jogadorId: 1,
        tipoEvento: 'partida',
        dataEvento: '2024-11-15',
        duracaoMinutos: 75,
        adversario: 'CRB Sub-15',
        resultado: '2x2',
        gols: 0,
        assistencias: 1,
        finalizacoes: 3,
        finalizacoesGol: 1,
        passesCertos: 28,
        passesErrados: 10,
        desarmes: 2,
        interceptacoes: 1,
        faltasCometidas: 2,
        faltasSofridas: 1,
        cartoesAmarelos: 1,
        cartoesVermelhos: 0,
        notaDesempenho: 6.5,
        observacoes: 'Partida irregular, tomou cartão amarelo por falta dura.'
    },
    {
        id: 4,
        jogadorId: 3,
        tipoEvento: 'partida',
        dataEvento: '2024-11-19',
        duracaoMinutos: 90,
        adversario: 'ASA Sub-17',
        resultado: '1x0',
        gols: 1,
        assistencias: 0,
        finalizacoes: 2,
        finalizacoesGol: 1,
        passesCertos: 45,
        passesErrados: 5,
        desarmes: 8,
        interceptacoes: 6,
        faltasCometidas: 1,
        faltasSofridas: 0,
        cartoesAmarelos: 0,
        cartoesVermelhos: 0,
        notaDesempenho: 9.0,
        observacoes: 'Defesa sólida e marcou o gol da vitória de cabeça.'
    },
    {
        id: 5,
        jogadorId: 5,
        tipoEvento: 'treino',
        dataEvento: '2024-11-21',
        duracaoMinutos: 45,
        gols: 0,
        assistencias: 0,
        passesCertos: 15,
        passesErrados: 3,
        desarmes: 0,
        interceptacoes: 0,
        faltasCometidas: 0,
        cartoesAmarelos: 0,
        cartoesVermelhos: 0,
        notaDesempenho: 7.0,
        observacoes: 'Treino de goleiro focado em reflexos e posicionamento.'
    }
];

// Filtra jogadores e estatísticas baseado no tipo de usuário
function getPlayersForUser() {
    if (!user) return [];
    
    if (user.userType === 'responsavel') {
        return mockPlayers.filter(player => player.emailResponsavel === user.email);
    }
    
    return mockPlayers;
}

function getStatsForPlayer(jogadorId) {
    return mockStats.filter(stat => stat.jogadorId === jogadorId);
}

const availablePlayers = getPlayersForUser();
let selectedPlayer = null;
let allStats = [];
let filteredStats = [];

// Elementos DOM
const jogadorSelect = document.getElementById('jogadorSelect');
const noPlayerState = document.getElementById('noPlayerState');
const historicoContent = document.getElementById('historicoContent');
const playerInfoCard = document.getElementById('playerInfoCard');
const tipoEventoFilter = document.getElementById('tipoEventoFilter');
const periodoFilter = document.getElementById('periodoFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const timeline = document.getElementById('timeline');
const emptyEventsState = document.getElementById('emptyEventsState');
const resultsCount = document.getElementById('resultsCount');

// Resumo
const totalGols = document.getElementById('totalGols');
const totalAssistencias = document.getElementById('totalAssistencias');
const totalEventos = document.getElementById('totalEventos');
const mediaNotas = document.getElementById('mediaNotas');

// Modal
const eventModal = document.getElementById('eventModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalEventTitle = document.getElementById('modalEventTitle');
const modalBody = document.getElementById('modalBody');

// Popula select de jogadores
availablePlayers.forEach(player => {
    const option = document.createElement('option');
    option.value = player.id;
    option.textContent = `${player.nome} - ${player.posicao}`;
    jogadorSelect.appendChild(option);
});

// Evento de seleção de jogador
jogadorSelect.addEventListener('change', () => {
    const jogadorId = parseInt(jogadorSelect.value);
    
    if (!jogadorId) {
        noPlayerState.style.display = 'flex';
        historicoContent.style.display = 'none';
        return;
    }
    
    selectedPlayer = availablePlayers.find(p => p.id === jogadorId);
    allStats = getStatsForPlayer(jogadorId);
    filteredStats = [...allStats];
    
    noPlayerState.style.display = 'none';
    historicoContent.style.display = 'block';
    
    renderPlayerInfo();
    renderSummary();
    renderTimeline();
});

// Renderiza informações do jogador
function renderPlayerInfo() {
    if (!selectedPlayer) return;
    
    const initials = selectedPlayer.nome.split(' ').map(n => n[0]).join('').substring(0, 2);
    const idade = calcularIdade(selectedPlayer.dataNascimento);
    
    playerInfoCard.innerHTML = `
        <div class="player-avatar-large">${initials}</div>
        <div class="player-info-details">
            <h3>${selectedPlayer.nome}</h3>
            <div class="player-meta">
                <div class="player-meta-item">
                    <span class="meta-label">Posição</span>
                    <span class="meta-value">${selectedPlayer.posicao}</span>
                </div>
                <div class="player-meta-item">
                    <span class="meta-label">Categoria</span>
                    <span class="meta-value">${selectedPlayer.categoria.toUpperCase()}</span>
                </div>
                <div class="player-meta-item">
                    <span class="meta-label">Idade</span>
                    <span class="meta-value">${idade} anos</span>
                </div>
            </div>
        </div>
    `;
}

// Renderiza resumo de estatísticas
function renderSummary() {
    const gols = filteredStats.reduce((sum, stat) => sum + (stat.gols || 0), 0);
    const assistencias = filteredStats.reduce((sum, stat) => sum + (stat.assistencias || 0), 0);
    const eventos = filteredStats.length;
    const media = eventos > 0 
        ? (filteredStats.reduce((sum, stat) => sum + (stat.notaDesempenho || 0), 0) / eventos).toFixed(1)
        : '0.0';
    
    totalGols.textContent = gols;
    totalAssistencias.textContent = assistencias;
    totalEventos.textContent = eventos;
    mediaNotas.textContent = media;
}

// Renderiza timeline
function renderTimeline() {
    timeline.innerHTML = '';
    
    if (filteredStats.length === 0) {
        emptyEventsState.style.display = 'flex';
        return;
    }
    
    emptyEventsState.style.display = 'none';
    
    // Ordena por data (mais recente primeiro)
    const sortedStats = [...filteredStats].sort((a, b) => 
        new Date(b.dataEvento) - new Date(a.dataEvento)
    );
    
    sortedStats.forEach(stat => {
        const item = createTimelineItem(stat);
        timeline.appendChild(item);
    });
    
    updateResultsCount();
}

// Cria item da timeline
function createTimelineItem(stat) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.onclick = () => showEventDetails(stat);
    
    const precisaoPasse = stat.passesCertos + stat.passesErrados > 0
        ? ((stat.passesCertos / (stat.passesCertos + stat.passesErrados)) * 100).toFixed(0)
        : 0;
    
    item.innerHTML = `
        <div class="timeline-marker ${stat.tipoEvento}"></div>
        <div class="timeline-content">
            <div class="timeline-header">
                <span class="timeline-date">${formatarData(stat.dataEvento)}</span>
                <span class="timeline-type">${stat.tipoEvento}</span>
            </div>
            ${stat.tipoEvento === 'partida' ? `
                <div style="margin-bottom: 12px; font-weight: 500; color: var(--color-text);">
                    ${stat.adversario} - ${stat.resultado}
                </div>
            ` : ''}
            <div class="timeline-stats">
                ${stat.gols > 0 ? `<div class="stat-item">⚽ <strong>${stat.gols}</strong> gol${stat.gols > 1 ? 's' : ''}</div>` : ''}
                ${stat.assistencias > 0 ? `<div class="stat-item">🎯 <strong>${stat.assistencias}</strong> assistência${stat.assistencias > 1 ? 's' : ''}</div>` : ''}
                <div class="stat-item">📊 <strong>${precisaoPasse}%</strong> precisão</div>
                <div class="stat-item">⭐ <strong>${stat.notaDesempenho || 0}</strong> nota</div>
                ${stat.cartoesAmarelos > 0 ? `<div class="stat-item">🟨 <strong>${stat.cartoesAmarelos}</strong></div>` : ''}
                ${stat.cartoesVermelhos > 0 ? `<div class="stat-item">🟥 <strong>${stat.cartoesVermelhos}</strong></div>` : ''}
            </div>
        </div>
    `;
    
    return item;
}

// Mostra detalhes do evento
function showEventDetails(stat) {
    modalEventTitle.textContent = `${stat.tipoEvento === 'partida' ? 'Partida' : 'Treino'} - ${formatarData(stat.dataEvento)}`;
    
    const precisaoPasse = stat.passesCertos + stat.passesErrados > 0
        ? ((stat.passesCertos / (stat.passesCertos + stat.passesErrados)) * 100).toFixed(1)
        : 0;
    
    modalBody.innerHTML = `
        ${stat.tipoEvento === 'partida' ? `
            <div class="modal-section">
                <h4>Informações da Partida</h4>
                <div class="modal-detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Adversário</span>
                        <span class="detail-value">${stat.adversario}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Resultado</span>
                        <span class="detail-value">${stat.resultado}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Minutos Jogados</span>
                        <span class="detail-value">${stat.duracaoMinutos}'</span>
                    </div>
                </div>
            </div>
        ` : `
            <div class="modal-section">
                <h4>Informações do Treino</h4>
                <div class="modal-detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Duração</span>
                        <span class="detail-value">${stat.duracaoMinutos} minutos</span>
                    </div>
                </div>
            </div>
        `}
        
        <div class="modal-section">
            <h4>Estatísticas Ofensivas</h4>
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Gols</span>
                    <span class="detail-value">${stat.gols || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Assistências</span>
                    <span class="detail-value">${stat.assistencias || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Finalizações</span>
                    <span class="detail-value">${stat.finalizacoes || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Finalizações no Gol</span>
                    <span class="detail-value">${stat.finalizacoesGol || 0}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Estatísticas de Passe</h4>
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Passes Certos</span>
                    <span class="detail-value">${stat.passesCertos || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Passes Errados</span>
                    <span class="detail-value">${stat.passesErrados || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total de Passes</span>
                    <span class="detail-value">${(stat.passesCertos || 0) + (stat.passesErrados || 0)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Precisão</span>
                    <span class="detail-value">${precisaoPasse}%</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Estatísticas Defensivas</h4>
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Desarmes</span>
                    <span class="detail-value">${stat.desarmes || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Interceptações</span>
                    <span class="detail-value">${stat.interceptacoes || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Faltas Cometidas</span>
                    <span class="detail-value">${stat.faltasCometidas || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Faltas Sofridas</span>
                    <span class="detail-value">${stat.faltasSofridas || 0}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Disciplina</h4>
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Cartões Amarelos</span>
                    <span class="detail-value">${stat.cartoesAmarelos || 0}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Cartões Vermelhos</span>
                    <span class="detail-value">${stat.cartoesVermelhos || 0}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Avaliação</h4>
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Nota de Desempenho</span>
                    <span class="detail-value">${stat.notaDesempenho || 0}</span>
                </div>
            </div>
            ${stat.observacoes ? `
                <div style="margin-top: 16px;">
                    <span class="detail-label">Observações</span>
                    <p style="margin-top: 8px; color: var(--color-text);">${stat.observacoes}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    eventModal.classList.add('show');
}

// Fecha modal
function closeModal() {
    eventModal.classList.remove('show');
}

modalClose.onclick = closeModal;
modalCloseBtn.onclick = closeModal;
modalOverlay.onclick = closeModal;

// Filtros
function applyFilters() {
    const tipoEvento = tipoEventoFilter.value;
    const periodo = periodoFilter.value;
    
    filteredStats = allStats.filter(stat => {
        const matchesTipo = !tipoEvento || stat.tipoEvento === tipoEvento;
        const matchesPeriodo = checkPeriodo(stat.dataEvento, periodo);
        
        return matchesTipo && matchesPeriodo;
    });
    
    renderSummary();
    renderTimeline();
}

function checkPeriodo(dataEvento, periodo) {
    if (periodo === 'todos') return true;
    
    const hoje = new Date();
    const data = new Date(dataEvento);
    const diffDays = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));
    
    switch (periodo) {
        case 'ultimos7':
            return diffDays <= 7;
        case 'ultimos30':
            return diffDays <= 30;
        case 'ultimos90':
            return diffDays <= 90;
        default:
            return true;
    }
}

tipoEventoFilter.addEventListener('change', applyFilters);
periodoFilter.addEventListener('change', applyFilters);

clearFiltersBtn.addEventListener('click', () => {
    tipoEventoFilter.value = '';
    periodoFilter.value = 'todos';
    applyFilters();
});

// Helpers
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

function formatarData(data) {
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

function updateResultsCount() {
    const count = filteredStats.length;
    resultsCount.textContent = `${count} evento${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
}
