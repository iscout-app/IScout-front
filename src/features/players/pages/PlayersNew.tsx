import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreatePlayerMutation } from '../hooks/usePlayersQuery'
import { PLAYER_POSITIONS, CreatePlayerDto } from '../types/player.types'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

const playerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  position: z.enum(PLAYER_POSITIONS as [string, ...string[]], {
    required_error: 'Posição é obrigatória',
  }),
  category: z.string().min(1, 'Categoria é obrigatória'),
  height: z.number().min(50, 'Altura deve ser maior que 50cm').max(250, 'Altura deve ser menor que 250cm'),
  weight: z.number().min(20, 'Peso deve ser maior que 20kg').max(200, 'Peso deve ser menor que 200kg'),
  emailResponsavel: z.string().email('Email inválido'),
  emailTecnico: z.string().email('Email inválido').optional().or(z.literal('')),
})

type PlayerFormData = z.infer<typeof playerSchema>

export default function PlayersNew() {
  const navigate = useNavigate()
  const createPlayer = useCreatePlayerMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      emailTecnico: '',
    },
  })

  const position = watch('position')

  const onSubmit = async (data: PlayerFormData) => {
    const payload: CreatePlayerDto = {
      ...data,
      height: Number(data.height),
      weight: Number(data.weight),
      emailTecnico: data.emailTecnico || undefined,
    }

    createPlayer.mutate(payload, {
      onSuccess: () => {
        navigate('/players')
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/players')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Cadastrar Jogador</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados do novo jogador
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dados do Jogador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: João Silva"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...register('birthDate')}
                  className={errors.birthDate ? 'border-destructive' : ''}
                />
                {errors.birthDate && (
                  <p className="text-xs text-destructive">{errors.birthDate.message}</p>
                )}
              </div>
            </div>

            {/* Position and Category */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="position">Posição *</Label>
                <Select
                  value={position}
                  onValueChange={(value) => setValue('position', value as any)}
                >
                  <SelectTrigger className={errors.position ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAYER_POSITIONS.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && (
                  <p className="text-xs text-destructive">{errors.position.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="Ex: Sub-17, Sub-20, Profissional"
                  className={errors.category ? 'border-destructive' : ''}
                />
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  {...register('height', { valueAsNumber: true })}
                  placeholder="Ex: 175"
                  className={errors.height ? 'border-destructive' : ''}
                />
                {errors.height && (
                  <p className="text-xs text-destructive">{errors.height.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  {...register('weight', { valueAsNumber: true })}
                  placeholder="Ex: 70"
                  className={errors.weight ? 'border-destructive' : ''}
                />
                {errors.weight && (
                  <p className="text-xs text-destructive">{errors.weight.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emailResponsavel">Email do Responsável *</Label>
                <Input
                  id="emailResponsavel"
                  type="email"
                  {...register('emailResponsavel')}
                  placeholder="responsavel@exemplo.com"
                  className={errors.emailResponsavel ? 'border-destructive' : ''}
                />
                {errors.emailResponsavel && (
                  <p className="text-xs text-destructive">{errors.emailResponsavel.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailTecnico">Email do Técnico (Opcional)</Label>
                <Input
                  id="emailTecnico"
                  type="email"
                  {...register('emailTecnico')}
                  placeholder="tecnico@exemplo.com"
                  className={errors.emailTecnico ? 'border-destructive' : ''}
                />
                {errors.emailTecnico && (
                  <p className="text-xs text-destructive">{errors.emailTecnico.message}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/players')}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Jogador'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
