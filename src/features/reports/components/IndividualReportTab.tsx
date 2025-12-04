import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileDown, Loader2 } from 'lucide-react'
import { usePlayersQuery } from '@/features/players/hooks/usePlayersQuery'
import { usePlayerReportQuery } from '../hooks/useReportsQuery'
import { PlayerReportPreview } from './PlayerReportPreview'
import { generateIndividualReportPDF } from '../utils/pdfGenerator'
import { useTeam } from '@/features/teams/context/TeamContext'
import toast from 'react-hot-toast'

export function IndividualReportTab() {
  const { currentTeam } = useTeam()
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const { data: players = [], isLoading: isLoadingPlayers } = usePlayersQuery(currentTeam?.id)
  const {
    data: reportData,
    isLoading: isLoadingReport,
    error,
  } = usePlayerReportQuery(selectedPlayerId || undefined)

  // Transform API data to PDF format
  const transformedData =
    reportData?.stats && reportData?.matches
      ? {
          id: reportData.stats.athlete.id,
          name: reportData.stats.athlete.name,
          position: reportData.stats.career.position,
          birthdate: reportData.stats.athlete.birthdate,
          shirtNumber: reportData.stats.career.shirtNumber,
          teamId: currentTeam?.id || '',
          totalMatches: reportData.stats.stats.matches,
          totalGoals: reportData.stats.stats.goals,
          totalAssists: reportData.stats.stats.assists,
          totalYellowCards: reportData.stats.stats.yellowCards,
          totalRedCards: reportData.stats.stats.redCards,
          averageRating: 0, // Not available
          goalsPerMatch: reportData.stats.stats.goalsPerMatch,
          assistsPerMatch: reportData.stats.stats.assistsPerMatch,
          passAccuracy: 0, // Not available
          tacklesPerMatch: 0, // Not available
          interceptionsPerMatch: 0, // Not available
          evolution: reportData.matches.map((match: any) => ({
            date: match.timestamp,
            goals: match.performance.goals,
            assists: match.performance.assists,
            rating: 0,
            yellowCards: match.performance.yellowCards,
            redCards: match.performance.redCards,
          })),
          recentMatches: reportData.matches.slice(0, 5).map((match: any) => ({
            date: match.timestamp,
            opponent: match.opponent.name,
            result: match.result,
            goals: match.performance.goals,
            assists: match.performance.assists,
            rating: 0,
          })),
        }
      : null

  const handleGeneratePDF = async () => {
    if (!transformedData) {
      toast.error('Selecione um jogador primeiro')
      return
    }

    try {
      setIsGenerating(true)
      // Simulate a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))
      generateIndividualReportPDF(transformedData as any)
      toast.success('Relatório gerado com sucesso!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Erro ao gerar relatório')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-24">
      {/* Player Selection */}
      <Card>
        <CardContent className="p-24">
          <div className="flex flex-col gap-16 md:flex-row md:items-end">
            <div className="flex-1 space-y-8">
              <Label htmlFor="player-select">Selecione o Jogador</Label>
              <Select
                value={selectedPlayerId}
                onValueChange={setSelectedPlayerId}
                disabled={isLoadingPlayers}
              >
                <SelectTrigger id="player-select" className="h-100">
                  <SelectValue placeholder="Escolha um jogador..." />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player: any) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} - {player.position} (#{player.shirtNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGeneratePDF}
              disabled={!selectedPlayerId || isGenerating || isLoadingReport}
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
                  Gerar Relatório Individual
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {isLoadingReport ? (
        <div className="flex items-center justify-center p-48">
          <Loader2 className="h-32 w-32 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-48 text-center">
            <p className="text-destructive">Erro ao carregar dados do jogador</p>
          </CardContent>
        </Card>
      ) : !selectedPlayerId ? (
        <Card>
          <CardContent className="p-48 text-center">
            <p className="text-muted-foreground">
              Selecione um jogador para visualizar o preview do relatório
            </p>
          </CardContent>
        </Card>
      ) : reportData ? (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Preview do Relatório</h3>
            <p className="text-sm text-muted-foreground">
              Dados atualizados em tempo real
            </p>
          </div>
          <PlayerReportPreview report={transformedData as any} />
        </>
      ) : null}
    </div>
  )
}
