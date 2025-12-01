// Controle de permissões baseado no tipo de usuário
// Baseado nas regras de negócio do documento de requisitos

// Permissões CRUD por role
export const ROLE_PERMISSIONS = {
    admin: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true,
    },
    tecnico: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true,
    },
    olheiro: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canViewAll: true,
    },
    responsavel: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canViewAll: false,
    },
};

export const PERMISSIONS = {
    // Gestão do Sistema (apenas Admin)
    CADASTRAR_USUARIO: ['admin'],
    GERENCIAR_PERFIS: ['admin'],
    AUTENTICAR_AUTORIZAR: ['admin'],
    
    // CSU02 - Cadastrar Jogador
    CADASTRAR_JOGADOR: ['admin', 'tecnico', 'olheiro'],
    
    // CSU03 - Registrar Estatística de Treino/Partida
    REGISTRAR_ESTATISTICA: ['admin', 'tecnico', 'olheiro'],
    
    // CSU04 - Visualizar Histórico de Desempenho
    VISUALIZAR_HISTORICO: ['admin', 'tecnico', 'olheiro', 'responsavel'],
    
    // CSU05 - Visualização de Evolução do Atleta (Gráfico Temporal)
    VISUALIZAR_EVOLUCAO: ['admin', 'tecnico', 'olheiro', 'responsavel'],
    
    // CSU06 - Gerar Relatórios Individuais
    RELATORIOS_INDIVIDUAIS: ['admin', 'tecnico', 'olheiro', 'responsavel'],
    
    // CSU07 - Gerar Relatório Coletivo
    RELATORIOS_COLETIVOS: ['admin', 'tecnico', 'olheiro', 'responsavel'],
    
    // Visualizar Lista de Jogadores
    VISUALIZAR_JOGADORES: ['admin', 'tecnico', 'olheiro', 'responsavel']
};

/**
 * Verifica se o usuário tem permissão para uma ação específica
 * @param {string} userType - Tipo do usuário (admin, tecnico, olheiro, responsavel)
 * @param {string} permission - Nome da permissão (chave do objeto PERMISSIONS)
 * @returns {boolean}
 */
export function hasPermission(userType, permission) {
    if (!userType || !permission) return false;
    return PERMISSIONS[permission]?.includes(userType.toLowerCase()) || false;
}

/**
 * Verifica se pode cadastrar usuários (apenas Admin)
 */
export function canCadastrarUsuario(userType) {
    return hasPermission(userType, 'CADASTRAR_USUARIO');
}

/**
 * Verifica se pode gerenciar perfis de acesso (apenas Admin)
 */
export function canGerenciarPerfis(userType) {
    return hasPermission(userType, 'GERENCIAR_PERFIS');
}

/**
 * Verifica se pode cadastrar jogadores (Admin, Técnico, Olheiro)
 */
export function canCadastrarJogador(userType) {
    return hasPermission(userType, 'CADASTRAR_JOGADOR');
}

/**
 * Verifica se pode registrar estatísticas (Admin, Técnico, Olheiro)
 */
export function canRegisterStats(userType) {
    return hasPermission(userType, 'REGISTRAR_ESTATISTICA');
}

/**
 * Verifica se pode visualizar histórico de desempenho (Todos)
 */
export function canViewHistorico(userType) {
    return hasPermission(userType, 'VISUALIZAR_HISTORICO');
}

/**
 * Verifica se pode visualizar evolução em gráfico (Todos)
 */
export function canViewEvolucao(userType) {
    return hasPermission(userType, 'VISUALIZAR_EVOLUCAO');
}

/**
 * Verifica se pode gerar relatórios individuais (Admin, Técnico, Olheiro)
 */
export function canGenerateIndividualReports(userType) {
    return hasPermission(userType, 'RELATORIOS_INDIVIDUAIS');
}

/**
 * Verifica se pode gerar relatórios coletivos (Admin, Técnico, Olheiro)
 */
export function canGenerateCollectiveReports(userType) {
    return hasPermission(userType, 'RELATORIOS_COLETIVOS');
}

/**
 * Verifica se pode visualizar jogadores (Todos)
 */
export function canViewJogadores(userType) {
    return hasPermission(userType, 'VISUALIZAR_JOGADORES');
}

/**
 * Retorna resumo das permissões do usuário
 * @param {string} userType - Tipo do usuário
 * @returns {object} Objeto com todas as permissões do usuário
 */
export function getUserPermissions(userType) {
    return {
        // Gestão do Sistema
        cadastrarUsuario: canCadastrarUsuario(userType),
        gerenciarPerfis: canGerenciarPerfis(userType),
        
        // Jogadores
        cadastrarJogador: canCadastrarJogador(userType),
        visualizarJogadores: canViewJogadores(userType),
        
        // Estatísticas
        registrarEstatistica: canRegisterStats(userType),
        visualizarHistorico: canViewHistorico(userType),
        visualizarEvolucao: canViewEvolucao(userType),
        
        // Relatórios
        relatoriosIndividuais: canGenerateIndividualReports(userType),
        relatoriosColetivos: canGenerateCollectiveReports(userType)
    };
}
