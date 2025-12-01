import { getAuthUser, clearAuthData, requireAuth } from '../utils/auth.js';
import { canRegisterStats, canCadastrarJogador } from '../utils/permissions.js';

// Verifica autenticação
if (!requireAuth()) {
    // Redireciona para login se não autenticado
}

// Mostra nome do usuário e controla navegação por permissão
const user = getAuthUser();
if (user) {
    document.getElementById('userName').textContent = user.email;
    
    // Controle de visibilidade dos links de navegação
    const estatisticasLink = document.querySelector('a[href="./estatisticas.html"]');
    const cadastrarLink = document.querySelector('a[href="./cadastro-jogador.html"]');
    
    // Esconde link de Estatísticas se não tiver permissão
    if (estatisticasLink && !canRegisterStats(user.userType)) {
        estatisticasLink.style.display = 'none';
    }
    
    // Esconde link de Cadastrar se não tiver permissão
    if (cadastrarLink && !canCadastrarJogador(user.userType)) {
        cadastrarLink.style.display = 'none';
    }
    
    // Esconde botão "+ Novo Jogador" se não tiver permissão
    const novoCadastroBtn = document.querySelector('.page-actions .btn');
    if (novoCadastroBtn && !canCadastrarJogador(user.userType)) {
        novoCadastroBtn.style.display = 'none';
    }
    
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    clearAuthData();
    window.location.href = '../index.html';
});

// Dados de demonstração dos jogadores
const mockPlayers = [
    {
        id: 1,
        nome: 'João Silva Santos',
        dataNascimento: '2010-05-15',
        categoria: 'sub-15',
        posicao: 'Meia',
        altura: 172,
        peso: 65,
        pePreferido: 'Direito',
        telefone: '(82) 99999-1111',
        emailResponsavel: 'responsavel@iscout.com',
        nomeResponsavel: 'Maria Silva',
        telefoneResponsavel: '(82) 99999-2222'
    },
    {
        id: 2,
        nome: 'Pedro Henrique Costa',
        dataNascimento: '2012-08-20',
        categoria: 'sub-13',
        posicao: 'Atacante',
        altura: 165,
        peso: 58,
        pePreferido: 'Esquerdo',
        telefone: '(82) 99999-3333',
        emailResponsavel: 'outro@email.com',
        nomeResponsavel: 'Ana Costa',
        telefoneResponsavel: '(82) 99999-4444'
    },
    {
        id: 3,
        nome: 'Lucas Oliveira',
        dataNascimento: '2009-03-10',
        categoria: 'sub-17',
        posicao: 'Zagueiro',
        altura: 180,
        peso: 75,
        pePreferido: 'Direito',
        telefone: '(82) 99999-5555',
        emailResponsavel: 'responsavel@iscout.com',
        nomeResponsavel: 'José Oliveira',
        telefoneResponsavel: '(82) 99999-6666'
    },
    {
        id: 4,
        nome: 'Gabriel Ferreira',
        dataNascimento: '2011-11-25',
        categoria: 'sub-15',
        posicao: 'Volante',
        altura: 170,
        peso: 68,
        pePreferido: 'Ambidestro',
        telefone: '(82) 99999-7777',
        emailResponsavel: 'outro2@email.com',
        nomeResponsavel: 'Carla Ferreira',
        telefoneResponsavel: '(82) 99999-8888'
    },
    {
        id: 5,
        nome: 'Rafael Souza',
        dataNascimento: '2013-07-05',
        categoria: 'sub-13',
        posicao: 'Goleiro',
        altura: 168,
        peso: 62,
        pePreferido: 'Direito',
        telefone: '(82) 99999-9999',
        emailResponsavel: 'responsavel@iscout.com',
        nomeResponsavel: 'Roberto Souza',
        telefoneResponsavel: '(82) 99999-0000'
    },
    {
        id: 6,
        nome: 'Matheus Lima',
        dataNascimento: '2010-02-14',
        categoria: 'sub-15',
        posicao: 'Lateral Direito',
        altura: 175,
        peso: 70,
        pePreferido: 'Direito',
        telefone: '(82) 98888-1111',
        emailResponsavel: 'outro3@email.com',
        nomeResponsavel: 'Fernanda Lima',
        telefoneResponsavel: '(82) 98888-2222'
    }
];

// Filtra jogadores baseado no tipo de usuário
function getPlayersForUser() {
    if (!user) return [];
    
    // Se for Responsável, mostra apenas jogadores associados a ele
    if (user.userType === 'responsavel') {
        return mockPlayers.filter(player => player.emailResponsavel === user.email);
    }
    
    // Técnico, Olheiro e Admin veem todos os jogadores
    return mockPlayers;
}

let allPlayers = getPlayersForUser();
let filteredPlayers = [...allPlayers];

// Elementos DOM
const playersGrid = document.getElementById('playersGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const categoriaFilter = document.getElementById('categoriaFilter');
const posicaoFilter = document.getElementById('posicaoFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const resultsCount = document.getElementById('resultsCount');

// Modal
const playerModal = document.getElementById('playerModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalPlayerName = document.getElementById('modalPlayerName');
const modalBody = document.getElementById('modalBody');
const editPlayerBtn = document.getElementById('editPlayerBtn');

// Carrega jogadores
function loadPlayers() {
    setTimeout(() => {
        loadingState.style.display = 'none';
        
        // Atualiza a mensagem do estado vazio se for responsável sem jogadores
        if (user.userType === 'responsavel' && allPlayers.length === 0) {
            emptyState.querySelector('h3').textContent = 'Nenhum jogador sob sua responsabilidade';
            emptyState.querySelector('p').textContent = 'Você verá aqui os jogadores cadastrados sob sua responsabilidade';
            const btnCadastro = emptyState.querySelector('.btn');
            if (btnCadastro) {
                btnCadastro.style.display = 'none';
            }
        }
        
        renderPlayers();
    }, 1000);
}

// Renderiza jogadores
function renderPlayers() {
    playersGrid.innerHTML = '';
    
    if (filteredPlayers.length === 0) {
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    filteredPlayers.forEach(player => {
        const card = createPlayerCard(player);
        playersGrid.appendChild(card);
    });
    
    updateResultsCount();
}

// Cria card do jogador
function createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.onclick = () => showPlayerDetails(player);
    
    const initials = player.nome.split(' ').map(n => n[0]).join('').substring(0, 2);
    const idade = calcularIdade(player.dataNascimento);
    
    card.innerHTML = `
        <div class="player-card-header">
            <div class="player-avatar">${initials}</div>
            <div class="player-info">
                <h3>${player.nome}</h3>
                <span class="player-position">${player.posicao}</span>
            </div>
        </div>
        <div class="player-details">
            <div class="detail-item">
                <span class="detail-label">Idade</span>
                <span class="detail-value">${idade} anos</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Categoria</span>
                <span class="detail-value">${player.categoria.toUpperCase()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Altura</span>
                <span class="detail-value">${player.altura} cm</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Pé</span>
                <span class="detail-value">${player.pePreferido}</span>
            </div>
        </div>
        <div class="player-tags">
            <span class="tag">${player.categoria.toUpperCase()}</span>
            <span class="tag">${player.posicao}</span>
        </div>
    `;
    
    return card;
}

// Calcula idade
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

// Mostra detalhes do jogador
function showPlayerDetails(player) {
    modalPlayerName.textContent = player.nome;
    
    const idade = calcularIdade(player.dataNascimento);
    
    modalBody.innerHTML = `
        <div class="modal-section">
            <h4>Dados Pessoais</h4>
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Data de Nascimento</span>
                    <span class="detail-value">${formatarData(player.dataNascimento)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Idade</span>
                    <span class="detail-value">${idade} anos</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Telefone</span>
                    <span class="detail-value">${player.telefone}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Responsável</h4>
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Nome</span>
                    <span class="detail-value">${player.nomeResponsavel}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Telefone</span>
                    <span class="detail-value">${player.telefoneResponsavel}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Dados Físicos</h4>
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Altura</span>
                    <span class="detail-value">${player.altura} cm</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Peso</span>
                    <span class="detail-value">${player.peso} kg</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pé Preferido</span>
                    <span class="detail-value">${player.pePreferido}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h4>Dados Técnicos</h4>
            <div class="modal-detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Posição</span>
                    <span class="detail-value">${player.posicao}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Categoria</span>
                    <span class="detail-value">${player.categoria.toUpperCase()}</span>
                </div>
            </div>
        </div>
    `;
    
    editPlayerBtn.onclick = () => {
        alert(`Funcionalidade de edição será implementada.\nJogador ID: ${player.id}`);
    };
    
    playerModal.classList.add('show');
}

// Fecha modal
function closeModal() {
    playerModal.classList.remove('show');
}

modalClose.onclick = closeModal;
modalCloseBtn.onclick = closeModal;
modalOverlay.onclick = closeModal;

// Formata data
function formatarData(data) {
    const date = new Date(data + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

// Atualiza contador
function updateResultsCount() {
    const count = filteredPlayers.length;
    resultsCount.textContent = `${count} jogador${count !== 1 ? 'es' : ''} encontrado${count !== 1 ? 's' : ''}`;
}

// Filtros
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoria = categoriaFilter.value;
    const posicao = posicaoFilter.value;
    
    filteredPlayers = allPlayers.filter(player => {
        const matchesSearch = player.nome.toLowerCase().includes(searchTerm) || 
                            player.posicao.toLowerCase().includes(searchTerm);
        const matchesCategoria = !categoria || player.categoria === categoria;
        const matchesPosicao = !posicao || player.posicao.toLowerCase().includes(posicao.toLowerCase());
        
        return matchesSearch && matchesCategoria && matchesPosicao;
    });
    
    renderPlayers();
}

searchInput.addEventListener('input', applyFilters);
categoriaFilter.addEventListener('change', applyFilters);
posicaoFilter.addEventListener('change', applyFilters);

clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    categoriaFilter.value = '';
    posicaoFilter.value = '';
    applyFilters();
});

// Inicializa
loadPlayers();
