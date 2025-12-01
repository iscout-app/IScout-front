import type { Permission, PermissionsMap, Role } from '@/types/permissions.types'

export const PERMISSIONS: PermissionsMap = {
  // Gestão do Sistema (apenas Admin)
  CADASTRAR_USUARIO: ['admin'],
  GERENCIAR_PERFIS: ['admin'],

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
  VISUALIZAR_JOGADORES: ['admin', 'tecnico', 'olheiro', 'responsavel'],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return PERMISSIONS[permission]?.includes(role) || false
}
