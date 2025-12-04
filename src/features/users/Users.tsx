import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Loader2 } from 'lucide-react'
import { useIsAdmin } from '@/lib/rbac/hooks'
import { useUsersQuery } from './hooks/useUsersQuery'
import { UserCard } from './components/UserCard'
import { UserFormModal } from './components/UserFormModal'
import type { UserRole, UserStatus } from './types/users.types'

export default function Users() {
  const isAdmin = useIsAdmin()
  const { data: users = [], isLoading } = useUsersQuery()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all')

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Apenas administradores podem acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = () => {
    setIsFormModalOpen(true)
  }

  return (
    <div className="space-y-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
        <p className="mt-8 text-muted-foreground">
          Cadastro de novos usuários do sistema (Admin)
        </p>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-24">
          <div className="flex flex-col gap-16 md:flex-row md:items-end">
            {/* Search */}
            <div className="flex-1 space-y-8">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-12 top-1/2 -translate-y-1/2 h-20 w-20 text-muted-foreground" />
                <Input
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-100 pl-40"
                />
              </div>
            </div>

            {/* Filter by Role */}
            <div className="flex-1 space-y-8">
              <label className="text-sm font-medium">Tipo de Usuário</label>
              <Select value={filterRole} onValueChange={(value) => setFilterRole(value as UserRole | 'all')}>
                <SelectTrigger className="h-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="olheiro">Olheiro</SelectItem>
                  <SelectItem value="responsavel">Responsável</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Status */}
            <div className="flex-1 space-y-8">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as UserStatus | 'all')}>
                <SelectTrigger className="h-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Create Button */}
            <Button onClick={handleCreateUser} className="h-50">
              <Plus className="h-20 w-20 mr-8" />
              Novo Usuário
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-48">
          <Loader2 className="h-32 w-32 animate-spin text-muted-foreground" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-48 text-center">
            <p className="text-muted-foreground">
              {users.length === 0
                ? 'Nenhum usuário cadastrado. Clique em "Novo Usuário" para começar.'
                : 'Nenhum usuário encontrado com os filtros aplicados.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {/* Modal */}
      <UserFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} />
    </div>
  )
}
