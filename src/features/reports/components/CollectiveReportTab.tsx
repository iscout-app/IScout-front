import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import { usePlayersQuery } from '@/features/players/hooks/usePlayersQuery'
import { useMultiplePlayersStatsQuery } from '../hooks/useReportsQuery'
import { PlayerSelector } from './PlayerSelector'
import { generateCollectiveReportPDF } from '../utils/pdfGenerator'
import { useTeam } from '@/features/teams/context/TeamContext'
import toast from 'react-hot-toast'

export function CollectiveReportTab() {
  const { currentTeam } = useTeam()
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')
  const [isGenerating, setIsGenerating] = useState(false)

  const { data: players = [], isLoading: isLoadingPlayers } = usePlayersQuery(currentTeam?.id)
  const {
    data: reportsData,
    isLoading: isLoadingReports,
  } = useMultiplePlayersStatsQuery(selectedPlayerIds)

  // Convert object to array for rendering and transform data structure
  const reportsArray = reportsData
    ? Object.values(reportsData)
        .filter(Boolean)
        .map((data) => ({
          id: data.athlete.id,
          name: data.athlete.name,
          position: data.career.position,
          birthdate: data.athlete.birthdate,
          shirtNumber: data.career.shirtNumber,
          teamId: currentTeam?.id || '',
          totalMatches: data.stats.matches,
          totalGoals: data.stats.goals,
          totalAssists: data.stats.assists,
          totalYellowCards: data.stats.yellowCards,
          totalRedCards: data.stats.redCards,
          averageRating: 0, // Not available
          goalsPerMatch: data.stats.goalsPerMatch,
          assistsPerMatch: data.stats.assistsPerMatch,
          passAccuracy: 0, // Not available
          tacklesPerMatch: 0, // Not available
          interceptionsPerMatch: 0, // Not available
          evolution: [],
          recentMatches: [],
        }))
    : []

  const handleTogglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    )
  }

  const handleGeneratePDF = async () => {
    if (selectedPlayerIds.length < 2) {
      toast.error('Selecione pelo menos 2 jogadores')
      return
    }

    if (reportsArray.length === 0) {
      toast.error('Aguarde o carregamento dos dados')
      return
    }

    try {
      setIsGenerating(true)
      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))
      generateCollectiveReportPDF(reportsArray)
      toast.success('Relatório coletivo gerado com sucesso!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Erro ao gerar relatório')
    } finally {
      setIsGenerating(false)
    }
  }

  const canGeneratePDF = selectedPlayerIds.length >= 2 && !isLoadingReports

  return (
    <div className="space-y-24">
      {/* Player Selection */}
      {isLoadingPlayers ? (
        <div className="flex items-center justify-center p-48">
          <Loader2 className="h-32 w-32 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <PlayerSelector
          players={players}
          selectedPlayerIds={selectedPlayerIds}
          onTogglePlayer={handleTogglePlayer}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          positionFilter={positionFilter}
          onPositionFilterChange={setPositionFilter}
        />
      )}

      {/* Generate Button */}
      {selectedPlayerIds.length > 0 && (
        <Card>
          <CardContent className="p-24">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {selectedPlayerIds.length} jogador{selectedPlayerIds.length !== 1 ? 'es' : ''}{' '}
                  selecionado{selectedPlayerIds.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedPlayerIds.length < 2
                    ? 'Selecione pelo menos 2 jogadores para gerar o relatório'
                    : 'Pronto para gerar o relatório comparativo'}
                </p>
              </div>
              <Button
                onClick={handleGeneratePDF}
                disabled={!canGeneratePDF || isGenerating}
                className="h-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-20 w-20 mr-8 animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <FileDown className="h-20 w-20 mr-8" />
                    Gerar Relatório Coletivo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Table */}
      {selectedPlayerIds.length >= 2 && reportsArray.length > 0 && (
        <Card>
          <CardContent className="p-24">
            <div className="mb-16">
              <h3 className="text-lg font-semibold">Preview Comparativo</h3>
              <p className="text-sm text-muted-foreground">
                Visualize os dados antes de gerar o PDF
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-8 font-semibold">Nome</th>
                    <th className="text-left p-8 font-semibold">Posição</th>
                    <th className="text-center p-8 font-semibold">Partidas</th>
                    <th className="text-center p-8 font-semibold">Gols</th>
                    <th className="text-center p-8 font-semibold">Assist.</th>
                    <th className="text-center p-8 font-semibold">Média</th>
                    <th className="text-center p-8 font-semibold">Cartões</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsArray.map((report: any) => (
                    <tr key={report.id} className="border-b hover:bg-muted/50">
                      <td className="p-8">{report.name}</td>
                      <td className="p-8">{report.position}</td>
                      <td className="p-8 text-center">{report.totalMatches}</td>
                      <td className="p-8 text-center">{report.totalGoals}</td>
                      <td className="p-8 text-center">{report.totalAssists}</td>
                      <td className="p-8 text-center">{report.averageRating.toFixed(1)}</td>
                      <td className="p-8 text-center">
                        <span className="text-yellow-500">{report.totalYellowCards}</span>
                        {' / '}
                        <span className="text-red-500">{report.totalRedCards}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
