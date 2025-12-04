import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target, Award, AlertCircle } from 'lucide-react'
import type { PlayerReportData } from '../types/reports.types'
import { calculateAge, formatNumber } from '../utils/reportAggregator'

interface PlayerReportPreviewProps {
  report: PlayerReportData
}

export function PlayerReportPreview({ report }: PlayerReportPreviewProps) {
  const age = calculateAge(report.birthdate)

  return (
    <div className="space-y-16">
      {/* Player Header */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Jogador</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-16 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-semibold">{report.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posição</p>
              <p className="font-semibold">{report.position}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Camisa</p>
              <p className="font-semibold">#{report.shirtNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Idade</p>
              <p className="font-semibold">{age} anos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-24">
            <div className="flex items-center gap-12">
              <div className="flex-shrink-0 w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-24 w-24 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total de Partidas</p>
                <p className="text-2xl font-bold">{report.totalMatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-24">
            <div className="flex items-center gap-12">
              <div className="flex-shrink-0 w-48 h-48 rounded-full bg-green-500/10 flex items-center justify-center">
                <Target className="h-24 w-24 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Gols</p>
                <p className="text-2xl font-bold">{report.totalGoals}</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(report.goalsPerMatch, 2)} por partida
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-24">
            <div className="flex items-center gap-12">
              <div className="flex-shrink-0 w-48 h-48 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Award className="h-24 w-24 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Assistências</p>
                <p className="text-2xl font-bold">{report.totalAssists}</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(report.assistsPerMatch, 2)} por partida
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-24">
            <div className="flex items-center gap-12">
              <div className="flex-shrink-0 w-48 h-48 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="h-24 w-24 text-yellow-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Média de Desempenho</p>
                <p className="text-2xl font-bold">{formatNumber(report.averageRating, 1)}</p>
                <p className="text-xs text-muted-foreground">de 10.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-16 md:grid-cols-3 lg:grid-cols-4">
            <div className="p-12 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Precisão de Passes</p>
              <p className="text-xl font-semibold">{formatNumber(report.passAccuracy, 1)}%</p>
            </div>
            <div className="p-12 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Desarmes/Partida</p>
              <p className="text-xl font-semibold">{formatNumber(report.tacklesPerMatch, 2)}</p>
            </div>
            <div className="p-12 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Interceptações/Partida</p>
              <p className="text-xl font-semibold">
                {formatNumber(report.interceptionsPerMatch, 2)}
              </p>
            </div>
            <div className="p-12 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Cartões</p>
              <p className="text-xl font-semibold">
                <span className="text-yellow-500">{report.totalYellowCards}</span>
                {' / '}
                <span className="text-red-500">{report.totalRedCards}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
