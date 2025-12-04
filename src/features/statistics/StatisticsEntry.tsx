import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { usePlayersQuery } from '@/features/players/hooks/usePlayersQuery'
import { useTeam } from '@/features/teams/context/TeamContext'
import { useAllTeamsQuery } from '@/features/teams/hooks/useTeamsQuery'
import { trainingsApi, matchesApi } from './api/statistics.api'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

// Training Form Schema
const trainingFormSchema = z.object({
  athleteId: z.string().uuid('Jogador é obrigatório'),
  eventType: z.literal('treino'),
  eventDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      return selectedDate <= today
    }, 'A data não pode ser no futuro'),
  trainingTitle: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(255, 'Título muito longo'),
  trainingDescription: z.string().max(4096, 'Descrição muito longa').optional(),
  minutesPlayed: z.number().int().min(0, 'Minutos não pode ser negativo').max(120, 'Máximo de 120 minutos'),
  // Offensive stats
  goals: z.number().int().min(0, 'Gols não pode ser negativo'),
  assists: z.number().int().min(0, 'Assistências não pode ser negativo'),
  shots: z.number().int().min(0, 'Finalizações não pode ser negativo'),
  shotsOnTarget: z.number().int().min(0, 'Finalizações no gol não pode ser negativo'),
  // Passing stats
  accuratePasses: z.number().int().min(0, 'Passes certos não pode ser negativo'),
  inaccuratePasses: z.number().int().min(0, 'Passes errados não pode ser negativo'),
  // Defensive stats
  tackles: z.number().int().min(0, 'Desarmes não pode ser negativo'),
  interceptions: z.number().int().min(0, 'Interceptações não pode ser negativo'),
  foulsCommitted: z.number().int().min(0, 'Faltas cometidas não pode ser negativo'),
  foulsSuffered: z.number().int().min(0, 'Faltas sofridas não pode ser negativo'),
  // Performance
  performanceRating: z.number().min(0, 'Nota mínima é 0').max(10, 'Nota máxima é 10').optional(),
  observations: z.string().max(4096, 'Observações muito longas').optional(),
}).refine((data) => {
  if (data.shotsOnTarget > data.shots) return false
  return true
}, {
  message: 'Finalizações no gol não pode ser maior que total de finalizações',
  path: ['shotsOnTarget'],
})

// Match Form Schema
const matchFormSchema = z.object({
  athleteId: z.string().uuid('Jogador é obrigatório'),
  eventType: z.literal('partida'),
  eventDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      return selectedDate <= today
    }, 'A data não pode ser no futuro'),
  eventTime: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida (formato: HH:MM)'),
  opponentTeamId: z.string().uuid('Time adversário é obrigatório'),
  isHomeTeam: z.boolean(),
  homeScore: z.number().int().min(0, 'Placar não pode ser negativo'),
  awayScore: z.number().int().min(0, 'Placar não pode ser negativo'),
  position: z.string().min(1, 'Posição é obrigatória'),
  goals: z.number().int().min(0, 'Gols não pode ser negativo'),
  assists: z.number().int().min(0, 'Assistências não pode ser negativo'),
  yellowCards: z.number().int().min(0, 'Cartões não pode ser negativo').max(2, 'Máximo de 2 cartões amarelos'),
  redCards: z.number().int().min(0, 'Cartões não pode ser negativo').max(1, 'Máximo de 1 cartão vermelho'),
  observations: z.string().max(4096, 'Observações muito longas').optional(),
})

type TrainingFormData = z.infer<typeof trainingFormSchema>
type MatchFormData = z.infer<typeof matchFormSchema>

const defaultTrainingValues: Partial<TrainingFormData> = {
  eventDate: new Date().toISOString().split('T')[0],
  minutesPlayed: 90,
  goals: 0,
  assists: 0,
  shots: 0,
  shotsOnTarget: 0,
  accuratePasses: 0,
  inaccuratePasses: 0,
  tackles: 0,
  interceptions: 0,
  foulsCommitted: 0,
  foulsSuffered: 0,
}

const defaultMatchValues: Partial<MatchFormData> = {
  eventDate: new Date().toISOString().split('T')[0],
  eventTime: '15:00',
  isHomeTeam: true,
  homeScore: 0,
  awayScore: 0,
  goals: 0,
  assists: 0,
  yellowCards: 0,
  redCards: 0,
}

const POSITIONS = [
  { value: 'goleiro', label: 'Goleiro' },
  { value: 'zagueiro', label: 'Zagueiro' },
  { value: 'lateral', label: 'Lateral' },
  { value: 'volante', label: 'Volante' },
  { value: 'meia', label: 'Meia' },
  { value: 'atacante', label: 'Atacante' },
]

export default function StatisticsEntry() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { currentTeam } = useTeam()
  const { data: players, isLoading: isLoadingPlayers } = usePlayersQuery(currentTeam?.id)
  const { data: teams, isLoading: isLoadingTeams } = useAllTeamsQuery()
  const [eventType, setEventType] = useState<'treino' | 'partida' | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Training form
  const trainingForm = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: defaultTrainingValues as any,
  })

  // Match form
  const matchForm = useForm<MatchFormData>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: defaultMatchValues as any,
  })

  // Select the active form based on eventType
  const activeForm = eventType === 'treino' ? trainingForm : matchForm

  // Watch values for calculations (training only)
  const trainingAccuratePasses = trainingForm.watch('accuratePasses') || 0
  const trainingInaccuratePasses = trainingForm.watch('inaccuratePasses') || 0

  const passAccuracy = useMemo(() => {
    const total = trainingAccuratePasses + trainingInaccuratePasses
    if (total === 0) return 0
    return Math.round((trainingAccuratePasses / total) * 100)
  }, [trainingAccuratePasses, trainingInaccuratePasses])

  const handleEventTypeChange = (newType: 'treino' | 'partida') => {
    setEventType(newType)
    // Set eventType in the appropriate form
    if (newType === 'treino') {
      trainingForm.setValue('eventType', 'treino')
    } else {
      matchForm.setValue('eventType', 'partida')
    }
  }

  const onSubmitTraining = async (data: TrainingFormData) => {
    if (!currentTeam) {
      toast.error('Nenhum time selecionado')
      return
    }

    // Prevent duplicate submissions
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      // Step 1: Create training
      const training = await trainingsApi.createTraining({
        teamId: currentTeam.id,
        date: data.eventDate,
      })

      // Step 2: Create training class
      const trainingClass = await trainingsApi.createTrainingClass(
        currentTeam.id,
        training.id,
        {
          title: data.trainingTitle,
          description: data.trainingDescription,
        }
      )

      // Step 3: Add athlete stats
      const stats = {
        minutesPlayed: data.minutesPlayed,
        goals: data.goals,
        assists: data.assists,
        shots: data.shots,
        shotsOnTarget: data.shotsOnTarget,
        accuratePasses: data.accuratePasses,
        inaccuratePasses: data.inaccuratePasses,
        tackles: data.tackles,
        interceptions: data.interceptions,
        foulsCommitted: data.foulsCommitted,
        foulsSuffered: data.foulsSuffered,
        performanceRating: data.performanceRating,
        observations: data.observations,
      }

      await trainingsApi.addAthleteStats(currentTeam.id, training.id, trainingClass.id, {
        athleteId: data.athleteId,
        stats,
      })

      toast.success('Treino registrado com sucesso!')

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['players'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      // Reset form completely
      trainingForm.reset(defaultTrainingValues as any)
      setEventType('')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao registrar treino')
      console.error('Training submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitMatch = async (data: MatchFormData) => {
    if (!currentTeam) {
      toast.error('Nenhum time selecionado')
      return
    }

    // Prevent duplicate submissions
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      // Build timestamp from date + time
      const timestamp = `${data.eventDate}T${data.eventTime}:00.000Z`

      // Determine home and away teams
      const homeTeamId = data.isHomeTeam ? currentTeam.id : data.opponentTeamId
      const awayTeamId = data.isHomeTeam ? data.opponentTeamId : currentTeam.id

      // Create match with athlete stats
      await matchesApi.createMatch({
        homeTeamId,
        awayTeamId,
        timestamp,
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        athletes: [
          {
            athleteId: data.athleteId,
            teamId: currentTeam.id,
            position: data.position,
            goals: data.goals,
            assists: data.assists,
            yellowCards: data.yellowCards,
            redCards: data.redCards,
          },
        ],
      })

      toast.success('Partida registrada com sucesso!')

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['players'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      // Reset form completely
      matchForm.reset(defaultMatchValues as any)
      setEventType('')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao registrar partida')
      console.error('Match submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registrar Estatísticas</h1>
        <p className="mt-8 text-muted-foreground">
          Registre o desempenho dos jogadores em treinos e partidas
        </p>
      </div>

      <form
        onSubmit={
          eventType === 'treino'
            ? trainingForm.handleSubmit(onSubmitTraining)
            : matchForm.handleSubmit(onSubmitMatch)
        }
        className="space-y-32"
      >
        {/* Event Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Selecione o Tipo de Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-16">
            <div className="grid gap-16 md:grid-cols-2">
              <div className="space-y-8">
                <Label htmlFor="eventType">Tipo de Evento *</Label>
                <Select
                  value={eventType || 'placeholder'}
                  onValueChange={(value) => value !== 'placeholder' && handleEventTypeChange(value as 'treino' | 'partida')}
                >
                  <SelectTrigger id="eventType" className="h-100">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>
                      Selecione...
                    </SelectItem>
                    <SelectItem value="treino">Treino</SelectItem>
                    <SelectItem value="partida">Partida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show form fields only after event type is selected */}
        {eventType && (
          <>
            {/* Player and Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-16">
                <div className="grid gap-16 md:grid-cols-2">
                  <div className="space-y-8">
                    <Label htmlFor="athleteId">Jogador *</Label>
                    <Select
                      value={
                        eventType === 'treino'
                          ? trainingForm.watch('athleteId') || 'placeholder'
                          : matchForm.watch('athleteId') || 'placeholder'
                      }
                      onValueChange={(value) => {
                        if (value !== 'placeholder') {
                          if (eventType === 'treino') {
                            trainingForm.setValue('athleteId', value)
                          } else {
                            matchForm.setValue('athleteId', value)
                          }
                        }
                      }}
                    >
                      <SelectTrigger
                        id="athleteId"
                        className={`h-100 ${activeForm.formState.errors.athleteId ? 'border-destructive' : ''}`}
                      >
                        <SelectValue placeholder="Selecione o jogador..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placeholder" disabled>
                          Selecione o jogador...
                        </SelectItem>
                        {isLoadingPlayers ? (
                          <SelectItem value="loading" disabled>
                            Carregando...
                          </SelectItem>
                        ) : (
                          players?.map((player: any) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} - {player.position} (#{player.shirtNumber})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {activeForm.formState.errors.athleteId && (
                      <p className="text-sm text-destructive">{activeForm.formState.errors.athleteId.message}</p>
                    )}
                  </div>

                  <div className="space-y-8">
                    <Label htmlFor="eventDate">Data do Evento *</Label>
                    {eventType === 'treino' ? (
                      <Input
                        id="eventDate"
                        type="date"
                        {...trainingForm.register('eventDate')}
                        className={`h-100 ${trainingForm.formState.errors.eventDate ? 'border-destructive' : ''}`}
                      />
                    ) : (
                      <Input
                        id="eventDate"
                        type="date"
                        {...matchForm.register('eventDate')}
                        className={`h-100 ${matchForm.formState.errors.eventDate ? 'border-destructive' : ''}`}
                      />
                    )}
                    {activeForm.formState.errors.eventDate && (
                      <p className="text-sm text-destructive">{activeForm.formState.errors.eventDate.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training-specific fields */}
            {eventType === 'treino' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes do Treino</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-16">
                    <div className="space-y-8">
                      <Label htmlFor="trainingTitle">Título do Treino *</Label>
                      <Input
                        id="trainingTitle"
                        {...trainingForm.register('trainingTitle')}
                        placeholder="Ex: Treino Técnico - Finalização"
                        className={`h-100 ${trainingForm.formState.errors.trainingTitle ? 'border-destructive' : ''}`}
                      />
                      {trainingForm.formState.errors.trainingTitle && (
                        <p className="text-sm text-destructive">{trainingForm.formState.errors.trainingTitle.message}</p>
                      )}
                    </div>

                    <div className="space-y-8">
                      <Label htmlFor="trainingDescription">Descrição do Treino</Label>
                      <Textarea
                        id="trainingDescription"
                        {...trainingForm.register('trainingDescription')}
                        rows={3}
                        placeholder="Descreva as atividades realizadas no treino..."
                      />
                    </div>

                    <div className="space-y-8">
                      <Label htmlFor="minutesPlayed">Minutos de Participação *</Label>
                      <Input
                        id="minutesPlayed"
                        type="number"
                        {...trainingForm.register('minutesPlayed', { valueAsNumber: true })}
                        placeholder="90"
                        min="0"
                        max="120"
                        className={`h-100 ${trainingForm.formState.errors.minutesPlayed ? 'border-destructive' : ''}`}
                      />
                      {trainingForm.formState.errors.minutesPlayed && (
                        <p className="text-sm text-destructive">{trainingForm.formState.errors.minutesPlayed.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Training: Offensive Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas Ofensivas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-16 md:grid-cols-4">
                      <div className="space-y-8">
                        <Label htmlFor="goals">Gols</Label>
                        <Input
                          id="goals"
                          type="number"
                          {...trainingForm.register('goals', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="assists">Assistências</Label>
                        <Input
                          id="assists"
                          type="number"
                          {...trainingForm.register('assists', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="shots">Finalizações</Label>
                        <Input
                          id="shots"
                          type="number"
                          {...trainingForm.register('shots', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="shotsOnTarget">Finalizações no Gol</Label>
                        <Input
                          id="shotsOnTarget"
                          type="number"
                          {...trainingForm.register('shotsOnTarget', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                        {trainingForm.formState.errors.shotsOnTarget && (
                          <p className="text-sm text-destructive">
                            {trainingForm.formState.errors.shotsOnTarget.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Training: Passing Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas de Passe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-16 md:grid-cols-3">
                      <div className="space-y-8">
                        <Label htmlFor="accuratePasses">Passes Certos</Label>
                        <Input
                          id="accuratePasses"
                          type="number"
                          {...trainingForm.register('accuratePasses', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="inaccuratePasses">Passes Errados</Label>
                        <Input
                          id="inaccuratePasses"
                          type="number"
                          {...trainingForm.register('inaccuratePasses', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="passAccuracy">Precisão (%)</Label>
                        <Input id="passAccuracy" value={`${passAccuracy}%`} readOnly className="bg-muted h-100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Training: Defensive Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas Defensivas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-16 md:grid-cols-4">
                      <div className="space-y-8">
                        <Label htmlFor="tackles">Desarmes</Label>
                        <Input
                          id="tackles"
                          type="number"
                          {...trainingForm.register('tackles', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="interceptions">Interceptações</Label>
                        <Input
                          id="interceptions"
                          type="number"
                          {...trainingForm.register('interceptions', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="foulsCommitted">Faltas Cometidas</Label>
                        <Input
                          id="foulsCommitted"
                          type="number"
                          {...trainingForm.register('foulsCommitted', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="foulsSuffered">Faltas Sofridas</Label>
                        <Input
                          id="foulsSuffered"
                          type="number"
                          {...trainingForm.register('foulsSuffered', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Training: Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Avaliação e Observações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-16">
                    <div className="space-y-8">
                      <Label htmlFor="performanceRating">Nota de Desempenho (0-10)</Label>
                      <Input
                        id="performanceRating"
                        type="number"
                        {...trainingForm.register('performanceRating', { valueAsNumber: true })}
                        placeholder="7.5"
                        min="0"
                        max="10"
                        step="0.1"
                        className="h-100"
                      />
                    </div>

                    <div className="space-y-8">
                      <Label htmlFor="observations">Observações do Técnico/Olheiro</Label>
                      <Textarea
                        id="observations"
                        {...trainingForm.register('observations')}
                        rows={4}
                        placeholder="Observações sobre o desempenho, pontos fortes, áreas a melhorar..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Match-specific fields */}
            {eventType === 'partida' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Partida</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-16">
                    <div className="grid gap-16 md:grid-cols-2">
                      <div className="space-y-8">
                        <Label htmlFor="eventTime">Horário da Partida *</Label>
                        <Input
                          id="eventTime"
                          type="time"
                          {...matchForm.register('eventTime')}
                          className={`h-100 ${matchForm.formState.errors.eventTime ? 'border-destructive' : ''}`}
                        />
                        {matchForm.formState.errors.eventTime && (
                          <p className="text-sm text-destructive">{matchForm.formState.errors.eventTime.message}</p>
                        )}
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="position">Posição do Jogador *</Label>
                        <Select
                          value={matchForm.watch('position') || 'placeholder'}
                          onValueChange={(value) => value !== 'placeholder' && matchForm.setValue('position', value)}
                        >
                          <SelectTrigger
                            id="position"
                            className={`h-100 ${matchForm.formState.errors.position ? 'border-destructive' : ''}`}
                          >
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="placeholder" disabled>
                              Selecione...
                            </SelectItem>
                            {POSITIONS.map((pos) => (
                              <SelectItem key={pos.value} value={pos.value}>
                                {pos.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {matchForm.formState.errors.position && (
                          <p className="text-sm text-destructive">{matchForm.formState.errors.position.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-16 md:grid-cols-2">
                      <div className="space-y-8">
                        <Label htmlFor="opponentTeamId">Time Adversário *</Label>
                        <Select
                          value={matchForm.watch('opponentTeamId') || 'placeholder'}
                          onValueChange={(value) =>
                            value !== 'placeholder' && matchForm.setValue('opponentTeamId', value)
                          }
                        >
                          <SelectTrigger
                            id="opponentTeamId"
                            className={`h-100 ${matchForm.formState.errors.opponentTeamId ? 'border-destructive' : ''}`}
                          >
                            <SelectValue placeholder="Selecione o adversário..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="placeholder" disabled>
                              Selecione o adversário...
                            </SelectItem>
                            {isLoadingTeams ? (
                              <SelectItem value="loading" disabled>
                                Carregando...
                              </SelectItem>
                            ) : (
                              teams
                                ?.filter((team: any) => team.id !== currentTeam?.id)
                                .map((team: any) => (
                                  <SelectItem key={team.id} value={team.id}>
                                    {team.fullName} ({team.shortName})
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                        {matchForm.formState.errors.opponentTeamId && (
                          <p className="text-sm text-destructive">
                            {matchForm.formState.errors.opponentTeamId.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="isHomeTeam">Local da Partida *</Label>
                        <Select
                          value={matchForm.watch('isHomeTeam')?.toString() || 'true'}
                          onValueChange={(value) => matchForm.setValue('isHomeTeam', value === 'true')}
                        >
                          <SelectTrigger id="isHomeTeam" className="h-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Casa (Mandante)</SelectItem>
                            <SelectItem value="false">Fora (Visitante)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-16 md:grid-cols-2">
                      <div className="space-y-8">
                        <Label htmlFor="homeScore">Placar Casa *</Label>
                        <Input
                          id="homeScore"
                          type="number"
                          {...matchForm.register('homeScore', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className={`h-100 ${matchForm.formState.errors.homeScore ? 'border-destructive' : ''}`}
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="awayScore">Placar Fora *</Label>
                        <Input
                          id="awayScore"
                          type="number"
                          {...matchForm.register('awayScore', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className={`h-100 ${matchForm.formState.errors.awayScore ? 'border-destructive' : ''}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Match: Player Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas do Jogador na Partida</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-16 md:grid-cols-4">
                      <div className="space-y-8">
                        <Label htmlFor="matchGoals">Gols</Label>
                        <Input
                          id="matchGoals"
                          type="number"
                          {...matchForm.register('goals', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="matchAssists">Assistências</Label>
                        <Input
                          id="matchAssists"
                          type="number"
                          {...matchForm.register('assists', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="matchYellowCards">Cartões Amarelos</Label>
                        <Input
                          id="matchYellowCards"
                          type="number"
                          {...matchForm.register('yellowCards', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          max="2"
                          className="h-100"
                        />
                      </div>

                      <div className="space-y-8">
                        <Label htmlFor="matchRedCards">Cartões Vermelhos</Label>
                        <Input
                          id="matchRedCards"
                          type="number"
                          {...matchForm.register('redCards', { valueAsNumber: true })}
                          placeholder="0"
                          min="0"
                          max="1"
                          className="h-100"
                        />
                      </div>
                    </div>

                    <div className="mt-16 space-y-8">
                      <Label htmlFor="matchObservations">Observações</Label>
                      <Textarea
                        id="matchObservations"
                        {...matchForm.register('observations')}
                        rows={4}
                        placeholder="Observações sobre o desempenho na partida..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-12">
              <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')} disabled={isSubmitting} className="h-50">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || !eventType} className="h-50 min-w-[200px]">
                {isSubmitting ? (
                  <span className="flex items-center gap-8">
                    <span className="h-16 w-16 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {eventType === 'treino' ? 'Registrando...' : 'Registrando...'}
                  </span>
                ) : (
                  eventType === 'treino' ? 'Registrar Treino' : 'Registrar Partida'
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
