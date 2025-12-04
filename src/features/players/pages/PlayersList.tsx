import { useState, useMemo } from 'react'
import { usePlayersQuery, useDeletePlayerMutation } from '../hooks/usePlayersQuery'
import type { Player } from '../types/player.types'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import { PlayerFormModal } from '../components/PlayerFormModal'
import { useTeam } from '@/features/teams/context/TeamContext'

function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export default function PlayersList() {
  const { currentTeam } = useTeam()
  const { data: players, isLoading, error } = usePlayersQuery(currentTeam?.id)
  const deletePlayerMutation = useDeletePlayerMutation()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('')
  const [posicaoFilter, setPosicaoFilter] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null)

  const handleDeletePlayer = (player: Player) => {
    if (!player.teamId) {
      toast.error('Não é possível deletar jogador sem time associado')
      return
    }

    if (confirm(`Tem certeza que deseja remover ${player.name}?`)) {
      deletePlayerMutation.mutate({ id: player.id, teamId: player.teamId })
      setSelectedPlayer(null)
    }
  }

  const handleOpenCreateModal = () => {
    setEditingPlayerId(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (playerId: string) => {
    setEditingPlayerId(playerId)
    setIsFormModalOpen(true)
    setSelectedPlayer(null)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setEditingPlayerId(null)
  }

  const filteredPlayers = useMemo(() => {
    if (!players) return []

    return players.filter((player: any) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategoria = !categoriaFilter
      const matchesPosicao =
        !posicaoFilter ||
        player.position.toLowerCase().includes(posicaoFilter.toLowerCase())

      return matchesSearch && matchesCategoria && matchesPosicao
    })
  }, [players, searchTerm, categoriaFilter, posicaoFilter])

  const clearFilters = () => {
    setSearchTerm('')
    setCategoriaFilter('')
    setPosicaoFilter('')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 gap-16">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary" />
        <p className="text-muted-foreground">Carregando jogadores...</p>
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
      {/* Page Header */}
      <div className="flex items-start justify-between gap-24">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Jogadores Cadastrados</h2>
          <p className="text-base text-muted-foreground mt-8">
            Gerencie os jogadores da escola
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="h-100"
        >
          + Novo Jogador
        </Button>
      </div>

      {/* Filters Section */}
      <div className="rounded-lg border border-border bg-surface p-24 shadow-sm">
        <div className="mb-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome ou posição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-100 pl-9"
            />
          </div>
        </div>
        <div className="grid gap-12 md:grid-cols-[1fr_1fr_auto]">
          <Select value={categoriaFilter || 'all'} onValueChange={(v) => setCategoriaFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="h-100">
              <SelectValue placeholder="Todas as Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              <SelectItem value="sub-11">Sub-11</SelectItem>
              <SelectItem value="sub-13">Sub-13</SelectItem>
              <SelectItem value="sub-15">Sub-15</SelectItem>
              <SelectItem value="sub-17">Sub-17</SelectItem>
              <SelectItem value="sub-20">Sub-20</SelectItem>
            </SelectContent>
          </Select>
          <Select value={posicaoFilter || 'all'} onValueChange={(v) => setPosicaoFilter(v === 'all' ? '' : v)}>
            <SelectTrigger className="h-100">
              <SelectValue placeholder="Todas as Posições" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Posições</SelectItem>
              <SelectItem value="goleiro">Goleiro</SelectItem>
              <SelectItem value="zagueiro">Zagueiro</SelectItem>
              <SelectItem value="lateral">Lateral</SelectItem>
              <SelectItem value="volante">Volante</SelectItem>
              <SelectItem value="meia">Meia</SelectItem>
              <SelectItem value="atacante">Atacante</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={clearFilters} className="h-100">
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm font-medium text-muted-foreground">
        {filteredPlayers.length} jogador{filteredPlayers.length !== 1 ? 'es' : ''} encontrado
        {filteredPlayers.length !== 1 ? 's' : ''}
      </div>

      {/* Players Grid */}
      {filteredPlayers.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-16 py-48 text-center">
          <div className="text-6xl opacity-30">⚽</div>
          <h3 className="text-xl font-semibold text-foreground">
            Nenhum jogador encontrado
          </h3>
          <p className="text-muted-foreground">
            Comece cadastrando o primeiro jogador da escola
          </p>
          <Button onClick={handleOpenCreateModal} className="h-100">
            Cadastrar Primeiro Jogador
          </Button>
        </div>
      ) : (
        <div className="grid gap-20 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player: any) => {
            const initials = player.name
              .split(' ')
              .map((n: any) => n[0])
              .join('')
              .substring(0, 2)
            const idade = calculateAge(player.birthdate)

            return (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="cursor-pointer rounded-lg border border-border bg-surface p-20 shadow-sm transition-all duration-normal hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <div className="mb-16 flex items-center gap-16">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-700 text-2xl font-bold text-white">
                    {initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-8">
                      <span className="text-sm text-muted-foreground">
                        {player.position}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {idade} anos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-12 border-t border-border pt-16">
                  {/* Estatísticas Principais */}
                  <div className="grid grid-cols-3 gap-12">
                    <div className="flex flex-col gap-4 text-center">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Partidas
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {player.stats.matches}
                      </span>
                    </div>
                    <div className="flex flex-col gap-4 text-center">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Gols
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {player.stats.goals}
                      </span>
                    </div>
                    <div className="flex flex-col gap-4 text-center">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Assist.
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {player.stats.assists}
                      </span>
                    </div>
                  </div>

                  {/* Estatísticas Secundárias */}
                  <div className="flex items-center justify-between border-t border-border pt-12">
                    <div className="flex items-center gap-8">
                      <span className="text-xs text-muted-foreground">Camisa:</span>
                      <span className="rounded-base border border-primary/20 bg-primary/10 px-8 py-2 text-xs font-bold text-primary">
                        #{player.shirtNumber || '0'}
                      </span>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-4">
                        <div className="h-3 w-3 rounded-sm bg-yellow-500"></div>
                        <span className="text-xs font-medium text-foreground">
                          {player.stats.yellowCards}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-3 w-3 rounded-sm bg-red-500"></div>
                        <span className="text-xs font-medium text-foreground">
                          {player.stats.redCards}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Player Details Modal */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 z-[1000] block"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPlayer(null)
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-1/2 top-1/2 flex max-h-[90vh] w-[90%] max-w-[600px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
            <div className="flex items-center justify-between border-b border-border p-24">
              <h3 className="text-xl font-semibold text-foreground">
                {selectedPlayer.name}
              </h3>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="flex h-8 w-8 items-center justify-center rounded-base text-3xl text-muted-foreground transition-all duration-fast hover:bg-secondary hover:text-foreground"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto p-24">
              {/* Avatar e Info Básica */}
              <div className="mb-24 flex items-center gap-20">
                <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-700 text-3xl font-bold text-white">
                  {selectedPlayer.name
                    .split(' ')
                    .map((n: any) => n[0])
                    .join('')
                    .substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    {selectedPlayer.name}
                  </h4>
                  <div className="mt-4 flex items-center gap-8">
                    <span className="text-sm text-muted-foreground">
                      {selectedPlayer.position}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="rounded-base border border-primary/20 bg-primary/10 px-8 py-2 text-xs font-bold text-primary">
                      #{selectedPlayer.shirtNumber || '0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div className="mb-24 rounded-lg border border-border bg-background p-16">
                <h4 className="mb-12 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Dados Pessoais
                </h4>
                <div className="grid grid-cols-2 gap-16">
                  <div>
                    <span className="text-xs text-muted-foreground">Data de Nascimento</span>
                    <p className="mt-2 text-base font-semibold text-foreground">
                      {new Date(selectedPlayer.birthdate + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Idade</span>
                    <p className="mt-2 text-base font-semibold text-foreground">
                      {calculateAge(selectedPlayer.birthdate)} anos
                    </p>
                  </div>
                </div>
              </div>

              {/* Estatísticas de Desempenho */}
              <div className="mb-24 rounded-lg border border-border bg-background p-16">
                <h4 className="mb-12 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Desempenho
                </h4>
                <div className="grid grid-cols-3 gap-16">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {selectedPlayer.stats.matches}
                    </p>
                    <span className="text-xs text-muted-foreground">Partidas</span>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {selectedPlayer.stats.goals}
                    </p>
                    <span className="text-xs text-muted-foreground">Gols</span>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {selectedPlayer.stats.assists}
                    </p>
                    <span className="text-xs text-muted-foreground">Assistências</span>
                  </div>
                </div>
              </div>

              {/* Disciplina */}
              <div className="rounded-lg border border-border bg-background p-16">
                <h4 className="mb-12 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Disciplina
                </h4>
                <div className="grid grid-cols-2 gap-16">
                  <div className="flex items-center gap-12">
                    <div className="flex h-10 w-10 items-center justify-center rounded-base bg-yellow-500/20">
                      <div className="h-4 w-4 rounded-sm bg-yellow-500"></div>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {selectedPlayer.stats.yellowCards}
                      </p>
                      <span className="text-xs text-muted-foreground">Cartões Amarelos</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="flex h-10 w-10 items-center justify-center rounded-base bg-red-500/20">
                      <div className="h-4 w-4 rounded-sm bg-red-500"></div>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {selectedPlayer.stats.redCards}
                      </p>
                      <span className="text-xs text-muted-foreground">Cartões Vermelhos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-12 border-t border-border p-24">
              <Button
                variant="destructive"
                onClick={() => selectedPlayer && handleDeletePlayer(selectedPlayer)}
                disabled={true}
                className="h-50 cursor-not-allowed opacity-50"
                title="Exclusão de jogadores ainda não disponível no backend"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover
              </Button>
              <div className="flex gap-12">
                <Button variant="secondary" onClick={() => setSelectedPlayer(null)} className="h-50">
                  Fechar
                </Button>
                <Button
                  onClick={() => handleOpenEditModal(selectedPlayer.id)}
                  disabled={true}
                  className="h-50 cursor-not-allowed opacity-50"
                  title="Edição de jogadores ainda não disponível no backend"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player Form Modal */}
      <PlayerFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        playerId={editingPlayerId}
      />
    </div>
  )
}
