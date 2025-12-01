import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayersQuery, useDeletePlayerMutation } from '../hooks/usePlayersQuery'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useCanPerformAction } from '@/lib/rbac/hooks'
import { filterPlayersByRole, applyFilters, calculateAge } from '../utils/filterPlayers'
import { PlayerFilters, PLAYER_POSITIONS } from '../types/player.types'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Search, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function PlayersList() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: players, isLoading, error } = usePlayersQuery()
  const deletePlayer = useDeletePlayerMutation()
  const canCreate = useCanPerformAction('create')
  const canEdit = useCanPerformAction('edit')
  const canDelete = useCanPerformAction('delete')

  const [filters, setFilters] = useState<PlayerFilters>({
    search: '',
    position: undefined,
    category: undefined,
  })

  const filteredPlayers = useMemo(() => {
    if (!players) return []
    const roleFiltered = filterPlayersByRole(players, user)
    return applyFilters(roleFiltered, filters)
  }, [players, user, filters])

  const categories = useMemo(() => {
    if (!players) return []
    return Array.from(new Set(players.map((p) => p.category)))
  }, [players])

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover o jogador "${name}"?`)) {
      deletePlayer.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Erro ao carregar jogadores"
        description={error instanceof Error ? error.message : 'Erro desconhecido'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jogadores</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os jogadores cadastrados no sistema
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => navigate('/players/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Jogador
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, posição..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.position || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, position: value === 'all' ? undefined : value as any })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as posições" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as posições</SelectItem>
                {PLAYER_POSITIONS.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Players Table */}
      {filteredPlayers.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Nenhum jogador encontrado"
          description={
            filters.search || filters.position || filters.category
              ? 'Tente ajustar os filtros de busca'
              : 'Cadastre o primeiro jogador para começar'
          }
          action={
            canCreate && !filters.search && !filters.position && !filters.category ? (
              <Button onClick={() => navigate('/players/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Jogador
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Altura/Peso</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{calculateAge(player.birthDate)} anos</TableCell>
                  <TableCell>
                    <Badge variant="outline">{player.position}</Badge>
                  </TableCell>
                  <TableCell>{player.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {player.height}cm / {player.weight}kg
                  </TableCell>
                  <TableCell className="text-sm">{player.emailResponsavel}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/players/${player.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => navigate(`/players/${player.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem
                            onClick={() => handleDelete(player.id, player.name)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Results Count */}
      {filteredPlayers.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredPlayers.length} jogador{filteredPlayers.length !== 1 ? 'es' : ''}
          {(filters.search || filters.position || filters.category) && ` (filtrado${filteredPlayers.length !== 1 ? 's' : ''})`}
        </div>
      )}
    </div>
  )
}
