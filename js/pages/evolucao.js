import { getAuthUser, clearAuthData, requireAuth } from '../utils/auth.js';
import { canViewEvolucao, canRegisterStats, canCadastrarJogador } from '../utils/permissions.js';

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
    
    // Verifica se tem permissão para visualizar evolução
    if (!canViewEvolucao(user.userType)) {
        alert('Acesso negado! Você não tem permissão para visualizar a evolução.');
        window.location.href = './jogadores.html';
    }
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    clearAuthData();
    window.location.href = '../index.html';
});

// Dados de jogadores (mock)
const mockPlayers = [
    {
        id: 1,
        nome: 'João Silva Santos',
        dataNascimento: '2010-05-15',
        categoria: 'sub-15',
        posicao: 'Meia',
        emailResponsavel: 'responsavel@iscout.com'
    },
    {
        id: 2,
        nome: 'Pedro Henrique Costa',
        dataNascimento: '2012-08-20',
        categoria: 'sub-13',
        posicao: 'Atacante',
        emailResponsavel: 'outro@email.com'
    },
    {
        id: 3,
        nome: 'Lucas Oliveira',
        dataNascimento: '2009-03-10',
        categoria: 'sub-17',
        posicao: 'Zagueiro',
        emailResponsavel: 'responsavel@iscout.com'
    },
    {
        id: 4,
        nome: 'Gabriel Ferreira',
        dataNascimento: '2011-11-25',
        categoria: 'sub-15',
        posicao: 'Volante',
        emailResponsavel: 'outro2@email.com'
    },
    {
        id: 5,
        nome: 'Rafael Souza',
        dataNascimento: '2013-07-05',
        categoria: 'sub-13',
        posicao: 'Goleiro',
        emailResponsavel: 'responsavel@iscout.com'
    },
    {
        id: 6,
        nome: 'Matheus Lima',
        dataNascimento: '2010-02-14',
        categoria: 'sub-15',
        posicao: 'Lateral Direito',
        emailResponsavel: 'outro3@email.com'
    }
];

// Dados de estatísticas (mock) - Mais dados para gráficos
const mockStats = [
    // João Silva Santos
    { id: 1, jogadorId: 1, tipoEvento: 'partida', dataEvento: '2024-11-20', duracaoMinutos: 90, gols: 1, assistencias: 2, passesCertos: 35, passesErrados: 8, desarmes: 3, interceptacoes: 2, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 8.5 },
    { id: 2, jogadorId: 1, tipoEvento: 'treino', dataEvento: '2024-11-18', duracaoMinutos: 60, gols: 0, assistencias: 0, passesCertos: 42, passesErrados: 5, desarmes: 5, interceptacoes: 3, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 7.5 },
    { id: 3, jogadorId: 1, tipoEvento: 'partida', dataEvento: '2024-11-15', duracaoMinutos: 75, gols: 0, assistencias: 1, passesCertos: 28, passesErrados: 10, desarmes: 2, interceptacoes: 1, cartoesAmarelos: 1, cartoesVermelhos: 0, notaDesempenho: 6.5 },
    { id: 4, jogadorId: 1, tipoEvento: 'treino', dataEvento: '2024-11-12', duracaoMinutos: 60, gols: 2, assistencias: 1, passesCertos: 38, passesErrados: 7, desarmes: 4, interceptacoes: 2, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 8.0 },
    { id: 5, jogadorId: 1, tipoEvento: 'partida', dataEvento: '2024-11-08', duracaoMinutos: 90, gols: 2, assistencias: 0, passesCertos: 40, passesErrados: 6, desarmes: 3, interceptacoes: 3, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 9.0 },
    { id: 6, jogadorId: 1, tipoEvento: 'treino', dataEvento: '2024-11-05', duracaoMinutos: 60, gols: 1, assistencias: 2, passesCertos: 45, passesErrados: 4, desarmes: 6, interceptacoes: 4, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 8.5 },
    { id: 7, jogadorId: 1, tipoEvento: 'partida', dataEvento: '2024-11-01', duracaoMinutos: 85, gols: 1, assistencias: 1, passesCertos: 32, passesErrados: 9, desarmes: 2, interceptacoes: 2, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 7.5 },
    { id: 8, jogadorId: 1, tipoEvento: 'treino', dataEvento: '2024-10-28', duracaoMinutos: 60, gols: 0, assistencias: 1, passesCertos: 37, passesErrados: 8, desarmes: 5, interceptacoes: 3, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 7.0 },
    
    // Lucas Oliveira
    { id: 9, jogadorId: 3, tipoEvento: 'partida', dataEvento: '2024-11-19', duracaoMinutos: 90, gols: 1, assistencias: 0, passesCertos: 45, passesErrados: 5, desarmes: 8, interceptacoes: 6, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 9.0 },
    { id: 10, jogadorId: 3, tipoEvento: 'treino', dataEvento: '2024-11-16', duracaoMinutos: 60, gols: 0, assistencias: 0, passesCertos: 50, passesErrados: 3, desarmes: 10, interceptacoes: 7, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 8.5 },
    { id: 11, jogadorId: 3, tipoEvento: 'partida', dataEvento: '2024-11-10', duracaoMinutos: 90, gols: 0, assistencias: 0, passesCertos: 42, passesErrados: 6, desarmes: 9, interceptacoes: 5, cartoesAmarelos: 1, cartoesVermelhos: 0, notaDesempenho: 7.5 },
    
    // Rafael Souza
    { id: 12, jogadorId: 5, tipoEvento: 'treino', dataEvento: '2024-11-21', duracaoMinutos: 45, gols: 0, assistencias: 0, passesCertos: 15, passesErrados: 3, desarmes: 0, interceptacoes: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 7.0 },
    { id: 13, jogadorId: 5, tipoEvento: 'partida', dataEvento: '2024-11-17', duracaoMinutos: 90, gols: 0, assistencias: 0, passesCertos: 20, passesErrados: 2, desarmes: 0, interceptacoes: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, notaDesempenho: 8.0 }
];

// Filtra jogadores baseado no tipo de usuário
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
let charts = {};

// Elementos DOM
const jogadorSelect = document.getElementById('jogadorSelect');
const noPlayerState = document.getElementById('noPlayerState');
const chartsContent = document.getElementById('chartsContent');
const playerInfoCard = document.getElementById('playerInfoCard');
const periodoFilter = document.getElementById('periodoFilter');
const tipoEventoFilter = document.getElementById('tipoEventoFilter');
const noDataState = document.getElementById('noDataState');

// Cards de estatísticas
const tendenciaGeral = document.getElementById('tendenciaGeral');
const golsPorEvento = document.getElementById('golsPorEvento');
const assistPorEvento = document.getElementById('assistPorEvento');
const melhorNota = document.getElementById('melhorNota');

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
        chartsContent.style.display = 'none';
        destroyAllCharts();
        return;
    }
    
    selectedPlayer = availablePlayers.find(p => p.id === jogadorId);
    allStats = getStatsForPlayer(jogadorId);
    filteredStats = [...allStats];
    
    if (allStats.length < 2) {
        noPlayerState.style.display = 'none';
        chartsContent.style.display = 'block';
        noDataState.style.display = 'flex';
        document.querySelectorAll('.chart-card').forEach(card => card.style.display = 'none');
        document.querySelector('.stats-cards-grid').style.display = 'none';
        renderPlayerInfo();
        return;
    }
    
    noPlayerState.style.display = 'none';
    noDataState.style.display = 'none';
    chartsContent.style.display = 'block';
    document.querySelectorAll('.chart-card').forEach(card => card.style.display = 'block');
    document.querySelector('.stats-cards-grid').style.display = 'grid';
    
    renderPlayerInfo();
    renderStatsCards();
    renderCharts();
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

// Renderiza cards de estatísticas resumidas
function renderStatsCards() {
    const eventos = filteredStats.length;
    const gols = filteredStats.reduce((sum, s) => sum + (s.gols || 0), 0);
    const assist = filteredStats.reduce((sum, s) => sum + (s.assistencias || 0), 0);
    const melhor = Math.max(...filteredStats.map(s => s.notaDesempenho || 0));
    
    // Calcula tendência (compara primeira metade com segunda metade)
    const meio = Math.floor(eventos / 2);
    const primeiraMetade = filteredStats.slice(0, meio);
    const segundaMetade = filteredStats.slice(meio);
    
    const mediaPrimeira = primeiraMetade.reduce((sum, s) => sum + s.notaDesempenho, 0) / primeiraMetade.length;
    const mediaSegunda = segundaMetade.reduce((sum, s) => sum + s.notaDesempenho, 0) / segundaMetade.length;
    
    let tendencia = '→ Estável';
    if (mediaSegunda > mediaPrimeira + 0.5) tendencia = '📈 Crescente';
    else if (mediaSegunda < mediaPrimeira - 0.5) tendencia = '📉 Decrescente';
    
    tendenciaGeral.textContent = tendencia;
    golsPorEvento.textContent = eventos > 0 ? (gols / eventos).toFixed(1) : '0.0';
    assistPorEvento.textContent = eventos > 0 ? (assist / eventos).toFixed(1) : '0.0';
    melhorNota.textContent = melhor.toFixed(1);
}

// Renderiza todos os gráficos
function renderCharts() {
    destroyAllCharts();
    
    // Ordena por data (mais antigo primeiro)
    const sortedStats = [...filteredStats].sort((a, b) => 
        new Date(a.dataEvento) - new Date(b.dataEvento)
    );
    
    const labels = sortedStats.map(s => formatarDataCurta(s.dataEvento));
    
    renderNotasChart(sortedStats, labels);
    renderGolsAssistChart(sortedStats, labels);
    renderPassesChart(sortedStats, labels);
    renderDefensivasChart(sortedStats, labels);
    renderCartoesChart(sortedStats, labels);
    renderComparativoChart();
}

// Gráfico de Notas
function renderNotasChart(stats, labels) {
    const ctx = document.getElementById('notasChart');
    
    charts.notas = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nota de Desempenho',
                data: stats.map(s => s.notaDesempenho),
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() + '20',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Gráfico de Gols e Assistências
function renderGolsAssistChart(stats, labels) {
    const ctx = document.getElementById('golsAssistChart');
    
    charts.golsAssist = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Gols',
                    data: stats.map(s => s.gols || 0),
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() + 'CC'
                },
                {
                    label: 'Assistências',
                    data: stats.map(s => s.assistencias || 0),
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-teal-300').trim() + 'CC'
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

// Gráfico de Precisão de Passes
function renderPassesChart(stats, labels) {
    const ctx = document.getElementById('passesChart');
    
    const precisoes = stats.map(s => {
        const total = (s.passesCertos || 0) + (s.passesErrados || 0);
        return total > 0 ? ((s.passesCertos / total) * 100).toFixed(1) : 0;
    });
    
    charts.passes = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Precisão de Passes (%)',
                data: precisoes,
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--color-teal-700').trim(),
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-teal-700').trim() + '20',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de Ações Defensivas
function renderDefensivasChart(stats, labels) {
    const ctx = document.getElementById('defensivasChart');
    
    charts.defensivas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Desarmes',
                    data: stats.map(s => s.desarmes || 0),
                    backgroundColor: '#3b82f6CC'
                },
                {
                    label: 'Interceptações',
                    data: stats.map(s => s.interceptacoes || 0),
                    backgroundColor: '#8b5cf6CC'
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

// Gráfico de Cartões
function renderCartoesChart(stats, labels) {
    const ctx = document.getElementById('cartoesChart');
    
    charts.cartoes = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cartões Amarelos',
                    data: stats.map(s => s.cartoesAmarelos || 0),
                    backgroundColor: '#fbbf24CC'
                },
                {
                    label: 'Cartões Vermelhos',
                    data: stats.map(s => s.cartoesVermelhos || 0),
                    backgroundColor: '#ef4444CC'
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

// Gráfico Comparativo: Treinos vs Partidas
function renderComparativoChart() {
    const ctx = document.getElementById('comparativoChart');
    
    const treinos = filteredStats.filter(s => s.tipoEvento === 'treino');
    const partidas = filteredStats.filter(s => s.tipoEvento === 'partida');
    
    const mediaTreinos = treinos.length > 0 
        ? (treinos.reduce((sum, s) => sum + s.notaDesempenho, 0) / treinos.length).toFixed(1)
        : 0;
    
    const mediaPartidas = partidas.length > 0
        ? (partidas.reduce((sum, s) => sum + s.notaDesempenho, 0) / partidas.length).toFixed(1)
        : 0;
    
    charts.comparativo = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Treinos', 'Partidas'],
            datasets: [{
                label: 'Média de Desempenho',
                data: [mediaTreinos, mediaPartidas],
                backgroundColor: [
                    getComputedStyle(document.documentElement).getPropertyValue('--color-teal-300').trim() + 'CC',
                    getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() + 'CC'
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

// Destrói todos os gráficos
function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};
}

// Filtros
function applyFilters() {
    const periodo = periodoFilter.value;
    const tipoEvento = tipoEventoFilter.value;
    
    filteredStats = allStats.filter(stat => {
        const matchesPeriodo = checkPeriodo(stat.dataEvento, periodo);
        const matchesTipo = !tipoEvento || tipoEvento === 'todos' || stat.tipoEvento === tipoEvento;
        
        return matchesPeriodo && matchesTipo;
    });
    
    if (filteredStats.length < 2) {
        noDataState.style.display = 'flex';
        document.querySelectorAll('.chart-card').forEach(card => card.style.display = 'none');
        document.querySelector('.stats-cards-grid').style.display = 'none';
        return;
    }
    
    noDataState.style.display = 'none';
    document.querySelectorAll('.chart-card').forEach(card => card.style.display = 'block');
    document.querySelector('.stats-cards-grid').style.display = 'grid';
    
    renderStatsCards();
    renderCharts();
}

function checkPeriodo(dataEvento, periodo) {
    if (periodo === 'todos') return true;
    
    const hoje = new Date();
    const data = new Date(dataEvento);
    const diffDays = Math.floor((hoje - data) / (1000 * 60 * 60 * 24));
    
    switch (periodo) {
        case 'ultimos30':
            return diffDays <= 30;
        case 'ultimos90':
            return diffDays <= 90;
        case 'ultimos180':
            return diffDays <= 180;
        case 'ultimo-ano':
            return diffDays <= 365;
        default:
            return true;
    }
}

periodoFilter.addEventListener('change', applyFilters);
tipoEventoFilter.addEventListener('change', applyFilters);

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

function formatarDataCurta(data) {
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
