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
import { useCreateTeamMutation } from '../hooks/useTeamsQuery'
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
}

export function TeamFormModal({ isOpen, onClose }: TeamFormModalProps) {
  const createMutation = useCreateTeamMutation()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: '',
        shortName: '',
        iconUrl: '',
        mainColorHex: '',
        secondaryColorHex: '',
      })
    }
  }, [isOpen, reset])

  const onSubmit = async (data: TeamFormData) => {
    try {
      await createMutation.mutateAsync({
        fullName: data.fullName,
        shortName: data.shortName || undefined,
        iconUrl: data.iconUrl || undefined,
        mainColorHex: data.mainColorHex || undefined,
        secondaryColorHex: data.secondaryColorHex || undefined,
      })

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
          <DialogTitle>Criar Novo Time</DialogTitle>
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
              <Label htmlFor="mainColorHex">Cor Principal (Hex)</Label>
              <div className="flex gap-8">
                <Input
                  id="mainColorHex"
                  {...register('mainColorHex')}
                  className="h-100"
                  placeholder="FF0000"
                  maxLength={6}
                />
                {register('mainColorHex').name && (
                  <div
                    className="h-100 w-100 rounded border"
                    style={{
                      backgroundColor: errors.mainColorHex
                        ? '#e5e7eb'
                        : `#${register('mainColorHex').name || 'e5e7eb'}`,
                    }}
                  />
                )}
              </div>
              {errors.mainColorHex && (
                <p className="text-sm text-destructive">{errors.mainColorHex.message}</p>
              )}
            </div>

            {/* Secondary Color */}
            <div className="space-y-8">
              <Label htmlFor="secondaryColorHex">Cor Secundária (Hex)</Label>
              <div className="flex gap-8">
                <Input
                  id="secondaryColorHex"
                  {...register('secondaryColorHex')}
                  className="h-100"
                  placeholder="000000"
                  maxLength={6}
                />
                {register('secondaryColorHex').name && (
                  <div
                    className="h-100 w-100 rounded border"
                    style={{
                      backgroundColor: errors.secondaryColorHex
                        ? '#e5e7eb'
                        : `#${register('secondaryColorHex').name || 'e5e7eb'}`,
                    }}
                  />
                )}
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
              {isSubmitting ? 'Criando...' : 'Criar Time'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
