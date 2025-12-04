import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { Player } from '@/features/players/types/player.types'

interface PlayerSelectorProps {
  players: Player[]
  selectedPlayerIds: string[]
  onTogglePlayer: (playerId: string) => void
  categoryFilter: string
  onCategoryFilterChange: (category: string) => void
  positionFilter: string
  onPositionFilterChange: (position: string) => void
}

export function PlayerSelector({
  players,
  selectedPlayerIds,
  onTogglePlayer,
  categoryFilter,
  onCategoryFilterChange,
  positionFilter,
  onPositionFilterChange,
}: PlayerSelectorProps) {
  // Extract unique categories and positions
  const categories = ['all', ...Array.from(new Set(players.map((p) => p.position)))]
  const positions = ['all', ...Array.from(new Set(players.map((p) => p.position)))]

  // Filter players
  const filteredPlayers = players.filter((player) => {
    const matchesCategory = categoryFilter === 'all' || player.position === categoryFilter
    const matchesPosition = positionFilter === 'all' || player.position === positionFilter
    return matchesCategory && matchesPosition
  })

  return (
    <div className="space-y-16">
      {/* Filters */}
      <Card>
        <CardContent className="p-24">
          <div className="flex flex-col gap-16 md:flex-row">
            <div className="flex-1 space-y-8">
              <Label htmlFor="category-filter">Filtrar por Categoria</Label>
              <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
                <SelectTrigger id="category-filter" className="h-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories
                    .filter((c) => c !== 'all')
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-8">
              <Label htmlFor="position-filter">Filtrar por Posição</Label>
              <Select value={positionFilter} onValueChange={onPositionFilterChange}>
                <SelectTrigger id="position-filter" className="h-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {positions
                    .filter((p) => p !== 'all')
                    .map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Count */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Selecione os Jogadores</h3>
        <Badge variant={selectedPlayerIds.length >= 2 ? 'default' : 'secondary'}>
          {selectedPlayerIds.length} selecionado{selectedPlayerIds.length !== 1 ? 's' : ''}
          {selectedPlayerIds.length < 2 && ' (mínimo 2)'}
        </Badge>
      </div>

      {/* Player List */}
      <Card>
        <CardContent className="p-24">
          {filteredPlayers.length === 0 ? (
            <div className="text-center p-24 text-muted-foreground">
              Nenhum jogador encontrado com os filtros aplicados
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlayers.map((player) => {
                const isSelected = selectedPlayerIds.includes(player.id)
                return (
                  <div
                    key={player.id}
                    className={`flex items-center gap-12 p-16 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary hover:bg-primary/15'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => onTogglePlayer(player.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onTogglePlayer(player.id)}
                      className="flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${isSelected ? 'text-primary' : ''}`}>
                        {player.name}
                      </p>
                      <div className="flex items-center gap-8 mt-4">
                        <span className="text-xs text-muted-foreground">{player.position}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">#{player.shirtNumber}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
