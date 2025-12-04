import { type Role } from './auth.types'

export type { Role }

export type Permission =
  | 'CADASTRAR_JOGADOR'
  | 'REGISTRAR_ESTATISTICA'
  | 'VISUALIZAR_HISTORICO'
  | 'VISUALIZAR_EVOLUCAO'
  | 'RELATORIOS_INDIVIDUAIS'
  | 'RELATORIOS_COLETIVOS'
  | 'VISUALIZAR_JOGADORES'

export type Action = 'create' | 'edit' | 'delete' | 'viewAll'

export interface RolePermissions {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canViewAll: boolean
}

export type RolePermissionsMap = Record<Role, RolePermissions>

export type PermissionsMap = Record<Permission, Role[]>
