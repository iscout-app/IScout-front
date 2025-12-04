import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from '@/components/ui/select'
import { useTeam } from '../context/TeamContext'
import { TeamFormModal } from './TeamFormModal'

export function TeamSelector() {
  const { currentTeam, teams, isLoading, setCurrentTeam } = useTeam()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleValueChange = (value: string) => {
    if (value === '__create__') {
      setShowCreateModal(true)
      return
    }

    const selectedTeam = teams?.find((t) => t.id === value)
    if (selectedTeam) {
      setCurrentTeam(selectedTeam)
    }
  }

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-[200px] h-50">
        <span className="text-sm">Carregando...</span>
      </Button>
    )
  }

  if (!teams || teams.length === 0) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setShowCreateModal(true)}
          className="h-50 gap-8"
        >
          <Plus className="h-16 w-16" />
          Criar Time
        </Button>
        <TeamFormModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      </>
    )
  }

  return (
    <>
      <Select value={currentTeam?.id || ''} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px] h-50">
          <SelectValue>
            {currentTeam ? (
              <div className="flex items-center gap-8 truncate">
                {currentTeam.iconUrl && (
                  <img
                    src={currentTeam.iconUrl}
                    alt=""
                    className="h-20 w-20 rounded-sm object-contain"
                  />
                )}
                <span className="truncate text-sm font-medium">
                  {currentTeam.shortName || currentTeam.fullName}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Selecione um time...</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <div className="flex items-center gap-8">
                {team.iconUrl && (
                  <img
                    src={team.iconUrl}
                    alt=""
                    className="h-20 w-20 rounded-sm object-contain"
                  />
                )}
                <span className="truncate">{team.fullName}</span>
              </div>
            </SelectItem>
          ))}
          <SelectSeparator />
          <SelectItem value="__create__">
            <div className="flex items-center gap-8">
              <Plus className="h-16 w-16" />
              Criar Novo Time
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <TeamFormModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </>
  )
}
