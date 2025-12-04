import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail } from 'lucide-react'
import type { User } from '../types/users.types'
import { USER_ROLE_LABELS } from '../types/users.types'

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'tecnico':
        return 'default'
      case 'olheiro':
        return 'secondary'
      case 'responsavel':
        return 'outline'
      default:
        return 'default'
    }
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    return status === 'active' ? 'default' : 'secondary'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-24">
        <div className="flex items-start gap-16">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-64 h-64 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              {getInitials(user.name)}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground truncate">{user.name}</h3>
              <div className="flex items-center gap-8 mt-4">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {USER_ROLE_LABELS[user.role]}
                </Badge>
                <Badge variant={getStatusBadgeVariant(user.status)}>
                  {user.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mt-12">
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <Mail className="h-14 w-14 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                  <Phone className="h-14 w-14 flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
