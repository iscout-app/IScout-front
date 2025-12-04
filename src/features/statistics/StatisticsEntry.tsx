import { useMemo } from 'react'
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
import { useCreateStatisticsMutation } from './hooks/useStatisticsQuery'

// Zod schema for statistics form with advanced validations
const statisticsFormSchema = z.object({
  athleteId: z.string().uuid('Jogador é obrigatório'),
  eventType: z.enum(['treino', 'partida']),
  eventDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      return selectedDate <= today
    }, 'A data não pode ser no futuro'),
  minutesPlayed: z.number().int().min(0, 'Minutos não pode ser negativo').max(120, 'Máximo de 120 minutos'),
  opponent: z.string().optional(),
  result: z.string().optional(),
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
  // Cards
  yellowCards: z.number().int().min(0, 'Cartões não pode ser negativo').max(2, 'Máximo de 2 cartões amarelos'),
  redCards: z.number().int().min(0, 'Cartões não pode ser negativo').max(1, 'Máximo de 1 cartão vermelho'),
  // Performance
  performanceRating: z.number().min(0, 'Nota mínima é 0').max(10, 'Nota máxima é 10').optional(),
  observations: z.string().max(4096, 'Observações muito longas (máximo 4096 caracteres)').optional(),
}).refine((data) => {
  // Validate shots on target cannot exceed total shots
  if (data.shotsOnTarget > data.shots) {
    return false
  }
  return true
}, {
  message: 'Finalizações no gol não pode ser maior que total de finalizações',
  path: ['shotsOnTarget'],
})

type StatisticsFormData = z.infer<typeof statisticsFormSchema>

// TODO: Get real teamId from auth context
const TEMP_TEAM_ID = '00000000-0000-0000-0000-000000000000'
// TODO: Create actual matches instead of using temp matchId
const TEMP_MATCH_ID = '00000000-0000-0000-0000-000000000000'

const defaultFormValues: Partial<StatisticsFormData> = {
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
  yellowCards: 0,
  redCards: 0,
}

export default function StatisticsEntry() {
  const navigate = useNavigate()
  const { data: players, isLoading: isLoadingPlayers } = usePlayersQuery(TEMP_TEAM_ID)
  const createMutation = useCreateStatisticsMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StatisticsFormData>({
    resolver: zodResolver(statisticsFormSchema),
    defaultValues: defaultFormValues,
  })

  const selectedPlayer = watch('athleteId')
  const eventType = watch('eventType')
  const goals = watch('goals')
  const assists = watch('assists')
  const accuratePasses = watch('accuratePasses')
  const inaccuratePasses = watch('inaccuratePasses')
  const tackles = watch('tackles')
  const interceptions = watch('interceptions')
  const yellowCards = watch('yellowCards')
  const redCards = watch('redCards')

  // Calculate pass accuracy
  const passAccuracy = useMemo(() => {
    const total = accuratePasses + inaccuratePasses
    if (total === 0) return 0
    return Math.round((accuratePasses / total) * 100)
  }, [accuratePasses, inaccuratePasses])

  // Calculate summary values
  const goalsAssists = goals + assists
  const totalPasses = accuratePasses + inaccuratePasses
  const defensiveActions = tackles + interceptions
  const disciplineSummary = yellowCards + redCards === 0 ? 'Limpo' : `${yellowCards} amarelo(s), ${redCards} vermelho(s)`

  const onSubmit = async (data: StatisticsFormData) => {
    try {
      const selectedPlayerData = players?.find((p) => p.id === data.athleteId)

      await createMutation.mutateAsync({
        athleteId: data.athleteId,
        matchId: TEMP_MATCH_ID, // TODO: Create actual match
        teamId: TEMP_TEAM_ID,
        position: selectedPlayerData?.position || 'N/A',
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
        yellowCards: data.yellowCards,
        redCards: data.redCards,
        performanceRating: data.performanceRating ? Math.round(data.performanceRating * 10) : undefined,
        observations: data.observations,
      })

      // Smart reset: preserve player, date, and event type for faster successive entries
      const preservedValues = {
        athleteId: data.athleteId,
        eventDate: data.eventDate,
        eventType: data.eventType,
      }

      reset({
        ...defaultFormValues,
        ...preservedValues,
      })
    } catch (error) {
      console.error('Form submission error:', error)
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-32">
        {/* Event Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações do Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-16">
            <div className="grid gap-16 md:grid-cols-2">
              <div className="space-y-8">
                <Label htmlFor="athleteId">Jogador *</Label>
                <Select
                  value={selectedPlayer || 'placeholder'}
                  onValueChange={(value) => value !== 'placeholder' && setValue('athleteId', value)}
                >
                  <SelectTrigger id="athleteId" className={`h-100 ${errors.athleteId ? 'border-destructive' : ''}`}>
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
                      players?.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} - #{player.shirtNumber}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.athleteId && <p className="text-sm text-destructive">{errors.athleteId.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="eventType">Tipo de Evento *</Label>
                <Select
                  value={eventType || 'placeholder'}
                  onValueChange={(value) => value !== 'placeholder' && setValue('eventType', value as 'treino' | 'partida')}
                >
                  <SelectTrigger id="eventType" className={`h-100 ${errors.eventType ? 'border-destructive' : ''}`}>
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
                {errors.eventType && <p className="text-sm text-destructive">{errors.eventType.message}</p>}
              </div>
            </div>

            <div className="grid gap-16 md:grid-cols-2">
              <div className="space-y-8">
                <Label htmlFor="eventDate">Data do Evento *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  {...register('eventDate')}
                  className={`h-100 ${errors.eventDate ? 'border-destructive' : ''}`}
                />
                {errors.eventDate && <p className="text-sm text-destructive">{errors.eventDate.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="minutesPlayed">Minutos Jogados *</Label>
                <Input
                  id="minutesPlayed"
                  type="number"
                  {...register('minutesPlayed', { valueAsNumber: true })}
                  placeholder="90"
                  min="0"
                  max="120"
                  className={`h-100 ${errors.minutesPlayed ? 'border-destructive' : ''}`}
                />
                {errors.minutesPlayed && <p className="text-sm text-destructive">{errors.minutesPlayed.message}</p>}
              </div>
            </div>

            {eventType === 'partida' && (
              <div className="grid gap-16 md:grid-cols-2">
                <div className="space-y-8">
                  <Label htmlFor="opponent">Adversário</Label>
                  <Input
                    id="opponent"
                    {...register('opponent')}
                    placeholder="Nome do time adversário"
                    className="h-100"
                  />
                </div>

                <div className="space-y-8">
                  <Label htmlFor="result">Resultado</Label>
                  <Input
                    id="result"
                    {...register('result')}
                    placeholder="Ex: 3x2"
                    className="h-100"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Offensive Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Ofensivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-16 md:grid-cols-4">
              <div className="space-y-8">
                <Label htmlFor="goals">Gols</Label>
                <Input id="goals" type="number" {...register('goals', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.goals && <p className="text-sm text-destructive">{errors.goals.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="assists">Assistências</Label>
                <Input id="assists" type="number" {...register('assists', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.assists && <p className="text-sm text-destructive">{errors.assists.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="shots">Finalizações</Label>
                <Input id="shots" type="number" {...register('shots', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.shots && <p className="text-sm text-destructive">{errors.shots.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="shotsOnTarget">Finalizações no Gol</Label>
                <Input id="shotsOnTarget" type="number" {...register('shotsOnTarget', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.shotsOnTarget && <p className="text-sm text-destructive">{errors.shotsOnTarget.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passing Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Passe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-16 md:grid-cols-3">
              <div className="space-y-8">
                <Label htmlFor="accuratePasses">Passes Certos</Label>
                <Input id="accuratePasses" type="number" {...register('accuratePasses', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.accuratePasses && <p className="text-sm text-destructive">{errors.accuratePasses.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="inaccuratePasses">Passes Errados</Label>
                <Input id="inaccuratePasses" type="number" {...register('inaccuratePasses', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.inaccuratePasses && <p className="text-sm text-destructive">{errors.inaccuratePasses.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="passAccuracy">Precisão (%)</Label>
                <Input id="passAccuracy" value={`${passAccuracy}%`} readOnly className="bg-muted h-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Defensive Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Defensivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-16 md:grid-cols-4">
              <div className="space-y-8">
                <Label htmlFor="tackles">Desarmes</Label>
                <Input id="tackles" type="number" {...register('tackles', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.tackles && <p className="text-sm text-destructive">{errors.tackles.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="interceptions">Interceptações</Label>
                <Input id="interceptions" type="number" {...register('interceptions', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.interceptions && <p className="text-sm text-destructive">{errors.interceptions.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="foulsCommitted">Faltas Cometidas</Label>
                <Input id="foulsCommitted" type="number" {...register('foulsCommitted', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.foulsCommitted && <p className="text-sm text-destructive">{errors.foulsCommitted.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="foulsSuffered">Faltas Sofridas</Label>
                <Input id="foulsSuffered" type="number" {...register('foulsSuffered', { valueAsNumber: true })} placeholder="0" min="0" className="h-100" />
                {errors.foulsSuffered && <p className="text-sm text-destructive">{errors.foulsSuffered.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards and Discipline */}
        <Card>
          <CardHeader>
            <CardTitle>Cartões e Disciplina</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-16 md:grid-cols-2">
              <div className="space-y-8">
                <Label htmlFor="yellowCards">Cartões Amarelos</Label>
                <Input
                  id="yellowCards"
                  type="number"
                  {...register('yellowCards', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  max="2"
                  className="h-100"
                />
                {errors.yellowCards && <p className="text-sm text-destructive">{errors.yellowCards.message}</p>}
              </div>

              <div className="space-y-8">
                <Label htmlFor="redCards">Cartões Vermelhos</Label>
                <Input
                  id="redCards"
                  type="number"
                  {...register('redCards', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  max="1"
                  className="h-100"
                />
                {errors.redCards && <p className="text-sm text-destructive">{errors.redCards.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance and Observations */}
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
                {...register('performanceRating', { valueAsNumber: true })}
                placeholder="7.5"
                min="0"
                max="10"
                step="0.1"
                className="h-100"
              />
              {errors.performanceRating && <p className="text-sm text-destructive">{errors.performanceRating.message}</p>}
            </div>

            <div className="space-y-8">
              <Label htmlFor="observations">Observações do Técnico/Olheiro</Label>
              <Textarea
                id="observations"
                {...register('observations')}
                rows={4}
                placeholder="Observações sobre o desempenho, pontos fortes, áreas a melhorar..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/8 to-primary/3 shadow-md">
          <CardHeader className="pb-16">
            <CardTitle className="text-lg font-bold text-primary">Resumo das Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-16 md:grid-cols-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Gols + Assistências</p>
                <p className="text-2xl font-bold">{goalsAssists}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Total de Passes</p>
                <p className="text-2xl font-bold">{totalPasses}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Ações Defensivas</p>
                <p className="text-2xl font-bold">{defensiveActions}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Disciplina</p>
                <p className="text-lg font-bold">{disciplineSummary}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-12">
          <Button type="button" variant="secondary" onClick={() => navigate('/jogadores')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar Estatísticas'}
          </Button>
        </div>
      </form>
    </div>
  )
}
