import { useAuth } from '@/features/auth/context/AuthContext'
import type { Permission, Action } from '@/types/permissions.types'
import { hasPermission } from './permissions'
import { getRolePermissions, getRoleDisplayName } from './roles'

/**
 * Hook to get current user's role
 * Note: Backend doesn't have role field yet, so we default to 'admin' for team owners
 */
export function useRole() {
  const { user } = useAuth()
  // If user has role, use it, otherwise default to 'admin' (team owner has full permissions)
  return user?.role || (user ? 'admin' : null)
}

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(permission: Permission): boolean {
  const role = useRole()
  if (!role) return false
  return hasPermission(role, permission)
}

/**
 * Hook to check if user can perform an action (create, edit, delete, viewAll)
 */
export function useCanPerformAction(action: Action): boolean {
  const role = useRole()
  if (!role) return false

  const permissions = getRolePermissions(role)

  const actionMap: Record<Action, keyof typeof permissions> = {
    create: 'canCreate',
    edit: 'canEdit',
    delete: 'canDelete',
    viewAll: 'canViewAll',
  }

  return permissions[actionMap[action]] === true
}

/**
 * Hook to get role display name
 */
export function useRoleDisplayName(): string {
  const role = useRole()
  if (!role) return 'Usuário'
  return getRoleDisplayName(role)
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const role = useRole()
  return role === 'admin'
}

/**
 * Hook to check if user is responsavel
 */
export function useIsResponsavel(): boolean {
  const role = useRole()
  return role === 'responsavel'
}

/**
 * Hook to get all current user's permissions
 */
export function usePermissions() {
  const role = useRole()
  if (!role) return null
  return getRolePermissions(role)
}
