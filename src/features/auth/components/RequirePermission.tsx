import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Permission } from '@/types/permissions.types'
import { usePermission } from '@/lib/rbac/hooks'

interface RequirePermissionProps {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function RequirePermission({
  permission,
  children,
  fallback,
}: RequirePermissionProps) {
  const hasPermission = usePermission(permission)

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
