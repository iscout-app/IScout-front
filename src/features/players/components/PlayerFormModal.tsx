import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  usePlayerQuery,
  useCreatePlayerMutation,
  useUpdatePlayerMutation,
} from '../hooks/usePlayersQuery'
import { useTeam } from '@/features/teams/context/TeamContext'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// Zod schema for player form
const playerFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo'),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato: YYYY-MM-DD)'),
  position: z.string().min(1, 'Posição é obrigatória').max(32, 'Posição muito longa'),
  shirtNumber: z.number().int().min(1, 'Número deve ser maior que 0').max(99, 'Número deve ser menor que 100'),
})

type PlayerFormData = z.infer<typeof playerFormSchema>

const POSITIONS = [
  { value: 'goleiro', label: 'Goleiro' },
  { value: 'zagueiro', label: 'Zagueiro' },
  { value: 'lateral', label: 'Lateral' },
  { value: 'volante', label: 'Volante' },
  { value: 'meia', label: 'Meia' },
  { value: 'atacante', label: 'Atacante' },
]

interface PlayerFormModalProps {
  isOpen: boolean
  onClose: () => void
  playerId?: string | null
}

export function PlayerFormModal({ isOpen, onClose, playerId }: PlayerFormModalProps) {
  const isEditMode = !!playerId
  const { currentTeam } = useTeam()
  const queryClient = useQueryClient()

  const { data: player, isLoading: isLoadingPlayer } = usePlayerQuery(
    playerId || '',
    currentTeam?.id || '',
  )
  const createMutation = useCreatePlayerMutation()
  const updateMutation = useUpdatePlayerMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerFormSchema),
  })

  const selectedPosition = watch('position')

  // Load player data when editing
  useEffect(() => {
    if (player && isEditMode) {
      setValue('name', player.name)
      setValue('birthdate', player.birthdate)
      setValue('position', player.position)
      setValue('shirtNumber', player.shirtNumber)
    }
  }, [player, isEditMode, setValue])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const onSubmit = async (data: PlayerFormData) => {
    if (!currentTeam) {
      toast.error('Nenhum time selecionado')
      return
    }

    try {
      if (isEditMode && playerId) {
        await updateMutation.mutateAsync({
          id: playerId,
          teamId: currentTeam.id,
          data: {
            name: data.name,
            birthdate: data.birthdate,
            position: data.position,
            shirtNumber: data.shirtNumber,
          },
        })
      } else {
        await createMutation.mutateAsync({
          teamId: currentTeam.id,
          data: {
            name: data.name,
            birthdate: data.birthdate,
            position: data.position,
            shirtNumber: data.shirtNumber,
          },
        })
      }

      // Invalidate queries to refresh dashboard and players list
      await queryClient.invalidateQueries({ queryKey: ['players'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      // Close modal only on success
      onClose()
    } catch (error) {
      // Error is handled by mutation hooks with toast
      // Modal stays open to allow user to fix errors or retry
      console.error('Form submission error:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[1000] block"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute left-1/2 top-1/2 flex max-h-[90vh] w-[90%] max-w-[700px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg z-[1001]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border p-24">
          <h3 className="text-xl font-semibold text-foreground">
            {isEditMode ? 'Editar Jogador' : 'Cadastrar Jogador'}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-base text-3xl text-muted-foreground transition-all duration-fast hover:bg-secondary hover:text-foreground"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-24">
          {isEditMode && isLoadingPlayer ? (
            <div className="flex flex-col items-center justify-center py-48 gap-16">
              <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-primary" />
              <p className="text-muted-foreground">Carregando dados do jogador...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-24">
              {/* Name */}
              <div className="space-y-8">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: João Silva"
                  className={`h-100 ${errors.name ? 'border-destructive' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Birthdate */}
              <div className="space-y-8">
                <Label htmlFor="birthdate">Data de Nascimento *</Label>
                <Input
                  id="birthdate"
                  type="date"
                  {...register('birthdate')}
                  className={`h-100 ${errors.birthdate ? 'border-destructive' : ''}`}
                />
                {errors.birthdate && (
                  <p className="text-sm text-destructive">{errors.birthdate.message}</p>
                )}
              </div>

              <div className="grid gap-24 md:grid-cols-2">
                {/* Position */}
                <div className="space-y-8">
                  <Label htmlFor="position">Posição *</Label>
                  <Select
                    value={selectedPosition || 'placeholder'}
                    onValueChange={(value) =>
                      value !== 'placeholder' && setValue('position', value)
                    }
                  >
                    <SelectTrigger
                      id="position"
                      className={`h-100 ${errors.position ? 'border-destructive' : ''}`}
                    >
                      <SelectValue placeholder="Selecione a posição" />
                    </SelectTrigger>
                    <SelectContent className="z-[1100]">
                      <SelectItem value="placeholder" disabled>
                        Selecione a posição
                      </SelectItem>
                      {POSITIONS.map((pos) => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.position && (
                    <p className="text-sm text-destructive">{errors.position.message}</p>
                  )}
                </div>

                {/* Shirt Number */}
                <div className="space-y-8">
                  <Label htmlFor="shirtNumber">Número da Camisa *</Label>
                  <Input
                    id="shirtNumber"
                    type="number"
                    {...register('shirtNumber', { valueAsNumber: true })}
                    placeholder="Ex: 10"
                    className={`h-100 ${errors.shirtNumber ? 'border-destructive' : ''}`}
                    min="1"
                    max="99"
                  />
                  {errors.shirtNumber && (
                    <p className="text-sm text-destructive">
                      {errors.shirtNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-12 pt-16 border-t border-border">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="h-50"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="h-50">
                  {isSubmitting
                    ? isEditMode
                      ? 'Salvando...'
                      : 'Cadastrando...'
                    : isEditMode
                      ? 'Salvar Alterações'
                      : 'Cadastrar Jogador'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
