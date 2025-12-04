import { useAuth } from '@/features/auth/context/AuthContext'
import { useRoleDisplayName } from '@/lib/rbac/hooks'
import type { Role } from '@/types/auth.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const ROLE_COLORS: Record<Role, string> = {
  admin: 'bg-red-500/12 text-red-600 border-red-500/25',
  tecnico: 'bg-teal-500/12 text-teal-600 border-teal-500/25',
  olheiro: 'bg-purple-500/12 text-purple-600 border-purple-500/25',
  responsavel: 'bg-green-500/12 text-green-600 border-green-500/25',
}

export function UserInfo() {
  const { user, logout } = useAuth()
  const roleDisplayName = useRoleDisplayName()

  if (!user) return null

  return (
    <div className="flex items-center gap-20">
      <div className="flex flex-col items-end gap-4">
        <span className="text-sm font-semibold text-foreground">{user.name || user.email}</span>
        <Badge
          variant="outline"
          className={cn(
            'text-[11px] font-semibold uppercase tracking-wider border',
            user.role ? ROLE_COLORS[user.role] : ''
          )}
        >
          {roleDisplayName}
        </Badge>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={logout}
        className="border-[1.5px] border-destructive/25 bg-destructive/10 text-destructive hover:bg-destructive/15 hover:border-destructive/40 hover:-translate-y-0.5 transition-transform"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  )
}
