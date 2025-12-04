import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePlayersQuery } from '@/features/players/hooks/usePlayersQuery'
import type { Player } from '@/features/players/types/player.types'

interface PlayerSelectorProps {
  value?: string
  onChange: (playerId: string) => void
  teamId?: string
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
}

export function PlayerSelector({
  value,
  onChange,
  teamId,
  placeholder = 'Selecione um jogador...',
  className = '',
  error = false,
  disabled = false,
}: PlayerSelectorProps) {
  const { data: players, isLoading } = usePlayersQuery(teamId)

  return (
    <Select
      value={value || 'placeholder'}
      onValueChange={(val) => val !== 'placeholder' && onChange(val)}
      disabled={disabled}
    >
      <SelectTrigger className={`h-100 ${error ? 'border-destructive' : ''} ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="placeholder" disabled>
          {placeholder}
        </SelectItem>
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Carregando jogadores...
          </SelectItem>
        ) : players && players.length > 0 ? (
          players.map((player: Player) => (
            <SelectItem key={player.id} value={player.id}>
              {player.name} - {player.position} (#{player.shirtNumber})
            </SelectItem>
          ))
        ) : (
          <SelectItem value="empty" disabled>
            Nenhum jogador encontrado
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
