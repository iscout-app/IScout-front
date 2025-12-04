import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateTeamMutation, useUpdateTeamMutation, useTeamQuery } from '../hooks/useTeamsQuery'
import { useQueryClient } from '@tanstack/react-query'

const teamFormSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255, 'Nome muito longo'),
  shortName: z.string().min(2, 'Sigla deve ter no mínimo 2 caracteres').max(4, 'Sigla deve ter no máximo 4 caracteres').optional().or(z.literal('')),
  iconUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  mainColorHex: z.string().regex(/^[0-9A-Fa-f]{6}$/, 'Cor deve ter 6 caracteres hexadecimais (ex: FF0000)').optional().or(z.literal('')),
  secondaryColorHex: z.string().regex(/^[0-9A-Fa-f]{6}$/, 'Cor deve ter 6 caracteres hexadecimais (ex: 000000)').optional().or(z.literal('')),
})

type TeamFormData = z.infer<typeof teamFormSchema>

interface TeamFormModalProps {
  isOpen: boolean
  onClose: () => void
  teamId?: string
}

export function TeamFormModal({ isOpen, onClose, teamId }: TeamFormModalProps) {
  const isEditMode = !!teamId
  const createMutation = useCreateTeamMutation()
  const updateMutation = useUpdateTeamMutation()
  const queryClient = useQueryClient()

  // Fetch existing team data if in edit mode
  const { data: existingTeam } = useTeamQuery(teamId)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      fullName: '',
      shortName: '',
      iconUrl: '',
      mainColorHex: '',
      secondaryColorHex: '',
    },
  })

  const mainColorHex = watch('mainColorHex')
  const secondaryColorHex = watch('secondaryColorHex')

  // Reset form when modal opens/closes or when team data loads
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && existingTeam) {
        // Pre-populate form with existing team data
        reset({
          fullName: existingTeam.fullName,
          shortName: existingTeam.shortName || '',
          iconUrl: existingTeam.iconUrl || '',
          mainColorHex: existingTeam.mainColorHex || '',
          secondaryColorHex: existingTeam.secondaryColorHex || '',
        })
      } else if (!isEditMode) {
        // Clear form for create mode
        reset({
          fullName: '',
          shortName: '',
          iconUrl: '',
          mainColorHex: '',
          secondaryColorHex: '',
        })
      }
    }
  }, [isOpen, isEditMode, existingTeam, reset])

  const onSubmit = async (data: TeamFormData) => {
    try {
      const payload = {
        fullName: data.fullName,
        shortName: data.shortName || undefined,
        iconUrl: data.iconUrl || undefined,
        mainColorHex: data.mainColorHex || undefined,
        secondaryColorHex: data.secondaryColorHex || undefined,
      }

      if (isEditMode && teamId) {
        // Update existing team
        await updateMutation.mutateAsync({ id: teamId, data: payload })
      } else {
        // Create new team
        await createMutation.mutateAsync(payload)
      }

      // Invalidate teams query to refresh team list
      await queryClient.invalidateQueries({ queryKey: ['teams'] })

      // Close modal
      onClose()

      // Reload page to update TeamContext and Dashboard
      window.location.reload()
    } catch (error) {
      // Error is handled by mutation with toast
      // Modal stays open to allow user to fix errors or retry
      console.error('Error submitting team form:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[1001]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Time' : 'Criar Novo Time'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          {/* Full Name */}
          <div className="space-y-8">
            <Label htmlFor="fullName">Nome Completo *</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              className="h-100"
              placeholder="Ex: Flamengo Football Club"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          {/* Short Name */}
          <div className="space-y-8">
            <Label htmlFor="shortName">Sigla (2-4 caracteres)</Label>
            <Input
              id="shortName"
              {...register('shortName')}
              className="h-100"
              placeholder="Ex: FLA"
              maxLength={4}
            />
            {errors.shortName && (
              <p className="text-sm text-destructive">{errors.shortName.message}</p>
            )}
          </div>

          {/* Icon URL */}
          <div className="space-y-8">
            <Label htmlFor="iconUrl">URL do Ícone/Logo</Label>
            <Input
              id="iconUrl"
              type="url"
              {...register('iconUrl')}
              className="h-100"
              placeholder="https://exemplo.com/logo.png"
            />
            {errors.iconUrl && (
              <p className="text-sm text-destructive">{errors.iconUrl.message}</p>
            )}
          </div>

          {/* Colors */}
          <div className="grid gap-16 md:grid-cols-2">
            {/* Main Color */}
            <div className="space-y-8">
              <Label htmlFor="mainColorHex">Cor Principal</Label>
              <div className="flex gap-8">
                <Input
                  id="mainColorHex"
                  {...register('mainColorHex')}
                  className="h-100 flex-1"
                  placeholder="FF0000"
                  maxLength={6}
                />
                <input
                  type="color"
                  value={mainColorHex ? `#${mainColorHex}` : '#14b8a6'}
                  onChange={(e) => setValue('mainColorHex', e.target.value.substring(1).toUpperCase())}
                  className="h-100 w-100 rounded border cursor-pointer"
                  title="Escolher cor"
                />
              </div>
              {errors.mainColorHex && (
                <p className="text-sm text-destructive">{errors.mainColorHex.message}</p>
              )}
            </div>

            {/* Secondary Color */}
            <div className="space-y-8">
              <Label htmlFor="secondaryColorHex">Cor Secundária</Label>
              <div className="flex gap-8">
                <Input
                  id="secondaryColorHex"
                  {...register('secondaryColorHex')}
                  className="h-100 flex-1"
                  placeholder="000000"
                  maxLength={6}
                />
                <input
                  type="color"
                  value={secondaryColorHex ? `#${secondaryColorHex}` : '#0d9488'}
                  onChange={(e) => setValue('secondaryColorHex', e.target.value.substring(1).toUpperCase())}
                  className="h-100 w-100 rounded border cursor-pointer"
                  title="Escolher cor"
                />
              </div>
              {errors.secondaryColorHex && (
                <p className="text-sm text-destructive">
                  {errors.secondaryColorHex.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="h-50">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-50">
              {isSubmitting
                ? isEditMode
                  ? 'Salvando...'
                  : 'Criando...'
                : isEditMode
                  ? 'Salvar Alterações'
                  : 'Criar Time'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
