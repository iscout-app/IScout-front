import { getAuthUser, clearAuthData, requireAuth } from '../utils/auth.js';
import { canRegisterStats, canCadastrarJogador } from '../utils/permissions.js';
import { http } from '../utils/http.js';
import API_CONFIG from '../config/api.js';

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

// Dashboard data
let dashboardData = null;

// Load dashboard data from API
async function loadDashboardData() {
    try {
        dashboardData = await http.get(API_CONFIG.endpoints.dashboard.summary);
        return dashboardData;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        return null;
    }
}

let charts = {};

// Inicializa o dashboard
function initDashboard() {
    renderWelcomeMessage();
    renderQuickActions();
    renderStatsOverview();
    renderTopPlayers();
    renderRecentStats();
    renderAtividadeChart();
    renderPosicoesChart();
    renderCategoriasChart();
    renderAlerts();
}

// Mensagem de boas-vindas
function renderWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeSubtitle = document.getElementById('welcomeSubtitle');
    
    const userTypeNames = {
        'admin': 'Administrador',
        'tecnico': 'Técnico',
        'olheiro': 'Olheiro',
        'responsavel': 'Responsável'
    };
    
    const userName = user.email.split('@')[0];
    const userTypeName = userTypeNames[user.userType] || 'Usuário';
    
    welcomeMessage.textContent = `Bem-vindo, ${userTypeName}`;
    welcomeSubtitle.textContent = `Visão geral ${user.userType === 'responsavel' ? 'dos seus jogadores' : 'do sistema'}`;
}

// Ações rápidas
function renderQuickActions() {
    const quickActions = document.getElementById('quickActions');
    
    const actions = [];
    
    if (canCadastrarJogador(user.userType)) {
        actions.push({
            text: '+ Novo Jogador',
            href: './cadastro-jogador.html'
        });
    }
    
    if (canRegisterStats(user.userType)) {
        actions.push({
            text: '+ Registrar Estatística',
            href: './estatisticas.html'
        });
    }
    
    actions.push({
        text: 'Ver Todos',
        href: './jogadores.html'
    });
    
    quickActions.innerHTML = actions.map(action => 
        `<a href="${action.href}" class="quick-action-btn">${action.text}</a>`
    ).join('');
}

// Cards de estatísticas principais
function renderStatsOverview() {
    const totalJogadores = availablePlayers.length;
    
    // Eventos esta semana
    const hoje = new Date();
    const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
    const eventosEstaSemana = availableStats.filter(s => 
        new Date(s.dataEvento) >= seteDiasAtras
    ).length;
    
    // Média geral
    const mediaGeral = availableStats.length > 0
        ? (availableStats.reduce((sum, s) => sum + s.notaDesempenho, 0) / availableStats.length).toFixed(1)
        : '0.0';
    
    // Gols esta semana
    const golsEstaSemana = availableStats
        .filter(s => new Date(s.dataEvento) >= seteDiasAtras)
        .reduce((sum, s) => sum + (s.gols || 0), 0);
    
    document.getElementById('totalJogadores').textContent = totalJogadores;
    document.getElementById('eventosEstaSemana').textContent = eventosEstaSemana;
    document.getElementById('mediaGeral').textContent = mediaGeral;
    document.getElementById('golsEstaSemana').textContent = golsEstaSemana;
}

// Top 5 jogadores
function renderTopPlayers() {
    const topPlayers = document.getElementById('topPlayers');
    
    // Calcula média de cada jogador
    const playerAverages = availablePlayers.map(player => {
        const playerStats = availableStats.filter(s => s.jogadorId === player.id);
        const average = playerStats.length > 0
            ? playerStats.reduce((sum, s) => sum + s.notaDesempenho, 0) / playerStats.length
            : 0;
        
        return { ...player, average };
    });
    
    // Ordena por média (maior primeiro)
    playerAverages.sort((a, b) => b.average - a.average);
    
    // Top 5
    const top5 = playerAverages.slice(0, 5);
    
    if (top5.length === 0) {
        topPlayers.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><p>Nenhum jogador cadastrado</p></div>';
        return;
    }
    
    topPlayers.innerHTML = top5.map((player, index) => `
        <div class="ranking-item" onclick="window.location.href='./historico.html'">
            <div class="ranking-position">${index + 1}</div>
            <div class="ranking-info">
                <span class="ranking-name">${player.nome}</span>
                <span class="ranking-position-text">${player.posicao}</span>
            </div>
            <div class="ranking-score">${player.average.toFixed(1)}</div>
        </div>
    `).join('');
}

// Últimos registros
function renderRecentStats() {
    const recentStats = document.getElementById('recentStats');
    
    // Ordena por data (mais recente primeiro)
    const sorted = [...availableStats].sort((a, b) => 
        new Date(b.dataEvento) - new Date(a.dataEvento)
    );
    
    // Top 5
    const recent5 = sorted.slice(0, 5);
    
    if (recent5.length === 0) {
        recentStats.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><p>Nenhuma estatística registrada</p></div>';
        return;
    }
    
    recentStats.innerHTML = recent5.map(stat => {
        const player = availablePlayers.find(p => p.id === stat.jogadorId);
        return `
            <div class="recent-item">
                <div class="recent-item-header">
                    <span class="recent-player-name">${player ? player.nome : 'Jogador'}</span>
                    <span class="recent-date">${formatarData(stat.dataEvento)}</span>
                </div>
                <span class="recent-type">${stat.tipoEvento}</span>
                <div class="recent-stats">
                    ${stat.gols > 0 ? `<span class="recent-stat">⚽ ${stat.gols} gol${stat.gols > 1 ? 's' : ''}</span>` : ''}
                    ${stat.assistencias > 0 ? `<span class="recent-stat">🎯 ${stat.assistencias} assist.</span>` : ''}
                    <span class="recent-stat">⭐ ${stat.notaDesempenho}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Gráfico de atividade recente
function renderAtividadeChart() {
    const ctx = document.getElementById('atividadeChart');
    
    // Últimos 7 dias
    const labels = [];
    const treinos = [];
    const partidas = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        labels.push(formatarDataCurta(dateStr));
        
        const dayStats = availableStats.filter(s => s.dataEvento === dateStr);
        treinos.push(dayStats.filter(s => s.tipoEvento === 'treino').length);
        partidas.push(dayStats.filter(s => s.tipoEvento === 'partida').length);
    }
    
    charts.atividade = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Treinos',
                    data: treinos,
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-teal-300').trim() + 'CC'
                },
                {
                    label: 'Partidas',
                    data: partidas,
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() + 'CC'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Gráfico de jogadores por posição
function renderPosicoesChart() {
    const ctx = document.getElementById('posicoesChart');
    
    const posicoes = {};
    availablePlayers.forEach(player => {
        const pos = player.posicao;
        posicoes[pos] = (posicoes[pos] || 0) + 1;
    });
    
    const labels = Object.keys(posicoes);
    const data = Object.values(posicoes);
    
    charts.posicoes = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#3b82f6CC',
                    '#8b5cf6CC',
                    '#ec4899CC',
                    '#f59e0bCC',
                    '#10b981CC',
                    '#06b6d4CC'
                ],
                borderWidth: 2,
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim()
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Gráfico de desempenho por categoria
function renderCategoriasChart() {
    const ctx = document.getElementById('categoriasChart');
    
    const categorias = {};
    
    availablePlayers.forEach(player => {
        if (!categorias[player.categoria]) {
            categorias[player.categoria] = [];
        }
        
        const playerStats = availableStats.filter(s => s.jogadorId === player.id);
        if (playerStats.length > 0) {
            const avg = playerStats.reduce((sum, s) => sum + s.notaDesempenho, 0) / playerStats.length;
            categorias[player.categoria].push(avg);
        }
    });
    
    const labels = Object.keys(categorias);
    const data = labels.map(cat => {
        const notas = categorias[cat];
        return notas.length > 0 
            ? (notas.reduce((sum, n) => sum + n, 0) / notas.length).toFixed(1)
            : 0;
    });
    
    charts.categorias = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(l => l.toUpperCase()),
            datasets: [{
                label: 'Média de Desempenho',
                data: data,
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() + 'CC',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

// Alertas
function renderAlerts() {
    const alertsList = document.getElementById('alertsList');
    
    const alerts = [];
    
    // Verifica jogadores sem estatísticas recentes
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    
    availablePlayers.forEach(player => {
        const recentStats = availableStats.filter(s => 
            s.jogadorId === player.id && new Date(s.dataEvento) >= trintaDiasAtras
        );
        
        if (recentStats.length === 0) {
            alerts.push({
                type: 'warning',
                icon: '⚠️',
                title: 'Sem estatísticas recentes',
                message: `${player.nome} não tem registros nos últimos 30 dias`
            });
        }
    });
    
    // Info sobre sistema
    if (user.userType === 'admin') {
        alerts.push({
            type: 'info',
            icon: 'ℹ️',
            title: 'Sistema em demonstração',
            message: 'Dados fictícios para fins de teste'
        });
    }
    
    if (alerts.length === 0) {
        alertsList.innerHTML = '<div class="empty-state"><div class="empty-icon">✅</div><p>Nenhum alerta no momento</p></div>';
        return;
    }
    
    alertsList.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <div class="alert-icon">${alert.icon}</div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-message">${alert.message}</div>
            </div>
        </div>
    `).join('');
}

// Helpers
function formatarData(data) {
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

function formatarDataCurta(data) {
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// Inicializa
async function init() {
    await loadDashboardData();
    if (dashboardData) {
        initDashboard();
    } else {
        console.error('Failed to load dashboard data');
        // You could show an error message to the user here
    }
}

init();
