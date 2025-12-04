import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Users, Trophy } from 'lucide-react'
import { useTeamsQuery } from '../hooks/useTeamsQuery'
import { TeamFormModal } from '../components/TeamFormModal'
import type { Team } from '../types/team.types'

export default function TeamsList() {
  const { data: teams, isLoading } = useTeamsQuery()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState<string | undefined>()

  const handleEditTeam = (teamId: string) => {
    setEditingTeamId(teamId)
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingTeamId(undefined)
  }

  if (isLoading) {
    return (
      <div className="space-y-24">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Meus Times</h1>
        </div>
        <p className="text-muted-foreground">Carregando times...</p>
      </div>
    )
  }

  return (
    <div className="space-y-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Times</h1>
          <p className="text-muted-foreground mt-8">
            Gerencie seus times e suas configurações
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="h-50 gap-8">
          <Plus className="h-20 w-20" />
          Criar Novo Time
        </Button>
      </div>

      {/* Teams Grid */}
      {!teams || teams.length === 0 ? (
        <Card>
          <CardContent className="p-48 text-center">
            <div className="flex flex-col items-center gap-16">
              <div className="h-64 w-64 rounded-full bg-muted flex items-center justify-center">
                <Trophy className="h-32 w-32 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nenhum time cadastrado</h3>
                <p className="text-sm text-muted-foreground mt-8">
                  Crie seu primeiro time para começar a gerenciar jogadores e partidas
                </p>
              </div>
              <Button onClick={() => setShowCreateModal(true)} className="h-50 gap-8">
                <Plus className="h-20 w-20" />
                Criar Primeiro Time
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-24 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team: Team) => (
            <Card key={team.id} className="overflow-hidden">
              {/* Team Header with Colors */}
              <div
                className="h-32 w-full"
                style={{
                  background: team.mainColorHex
                    ? `linear-gradient(90deg, #${team.mainColorHex} 0%, #${team.secondaryColorHex || team.mainColorHex} 100%)`
                    : 'linear-gradient(90deg, #0d9488 0%, #14b8a6 100%)',
                }}
              />

              <CardHeader>
                <div className="flex items-start justify-between gap-12">
                  <div className="flex items-center gap-12 flex-1 min-w-0">
                    {team.iconUrl && (
                      <img
                        src={team.iconUrl}
                        alt=""
                        className="h-48 w-48 rounded-lg object-contain bg-muted p-4 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{team.fullName}</CardTitle>
                      {team.shortName && (
                        <p className="text-sm text-muted-foreground mt-4">{team.shortName}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditTeam(team.id)}
                    className="h-36 w-36 flex-shrink-0"
                  >
                    <Edit className="h-16 w-16" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-12">
                  {/* Stats placeholder - will be populated with actual data */}
                  <div className="flex items-center gap-8 text-sm">
                    <Users className="h-16 w-16 text-muted-foreground" />
                    <span className="text-muted-foreground">Jogadores</span>
                  </div>
                  <div className="flex items-center gap-8 text-sm">
                    <Trophy className="h-16 w-16 text-muted-foreground" />
                    <span className="text-muted-foreground">Partidas</span>
                  </div>
                </div>

                {/* Color Preview */}
                {(team.mainColorHex || team.secondaryColorHex) && (
                  <div className="mt-16 flex gap-8">
                    {team.mainColorHex && (
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-4">Cor Principal</p>
                        <div
                          className="h-24 rounded border"
                          style={{ backgroundColor: `#${team.mainColorHex}` }}
                        />
                      </div>
                    )}
                    {team.secondaryColorHex && (
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-4">Cor Secundária</p>
                        <div
                          className="h-24 rounded border"
                          style={{ backgroundColor: `#${team.secondaryColorHex}` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <TeamFormModal
        isOpen={showCreateModal || !!editingTeamId}
        onClose={handleCloseModal}
        teamId={editingTeamId}
      />
    </div>
  )
}
