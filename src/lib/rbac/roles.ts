import type { Role, RolePermissions, RolePermissionsMap } from '@/types/permissions.types'

export const ROLE_PERMISSIONS: RolePermissionsMap = {
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
}

export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  admin: 'Administrador',
  tecnico: 'Técnico',
  olheiro: 'Olheiro',
  responsavel: 'Responsável',
}

export function getRolePermissions(role: Role): RolePermissions {
  return ROLE_PERMISSIONS[role]
}

export function getRoleDisplayName(role: Role): string {
  return ROLE_DISPLAY_NAMES[role] || 'Usuário'
}
