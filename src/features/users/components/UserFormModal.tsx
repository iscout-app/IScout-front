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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateUserMutation } from '../hooks/useUsersQuery'
import { useQueryClient } from '@tanstack/react-query'
import type { UserRole, UserStatus } from '../types/users.types'
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '../types/users.types'

const userFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  email: z.string().email('Email inválido').max(255, 'Email muito longo'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').max(255, 'Senha muito longa'),
  role: z.enum(['admin', 'tecnico', 'olheiro', 'responsavel']),
  status: z.enum(['active', 'inactive']),
  phone: z.string().max(20, 'Telefone muito longo').optional().or(z.literal('')),
})

type UserFormData = z.infer<typeof userFormSchema>

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserFormModal({ isOpen, onClose }: UserFormModalProps) {
  const createMutation = useCreateUserMutation()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'tecnico',
      status: 'active',
      phone: '',
    },
  })

  const role = watch('role')
  const status = watch('status')

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        email: '',
        password: '',
        role: 'tecnico',
        status: 'active',
        phone: '',
      })
    }
  }, [isOpen, reset])

  const onSubmit = async (data: UserFormData) => {
    try {
      // Create new user
      await createMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status,
        phone: data.phone || undefined,
      })

      // Invalidate queries to refresh users list
      await queryClient.invalidateQueries({ queryKey: ['users'] })

      // Close modal only on success
      onClose()
    } catch (error) {
      // Error is handled by mutation with toast
      // Modal stays open to allow user to fix errors or retry
      console.error('Error submitting user form:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[1001]">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          {/* Name */}
          <div className="space-y-8">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register('name')}
              className="h-100"
              placeholder="Nome completo"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-8">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="h-100"
              placeholder="email@exemplo.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-8">
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className="h-100"
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-8">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className="h-100"
              placeholder="(00) 00000-0000"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-8">
            <Label htmlFor="role">Tipo de Usuário *</Label>
            <Select
              value={role}
              onValueChange={(value) => setValue('role', value as UserRole)}
            >
              <SelectTrigger className="h-100 z-[1100]">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="z-[1100]">
                {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-8">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as UserStatus)}
            >
              <SelectTrigger className="h-100 z-[1100]">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="z-[1100]">
                {Object.entries(USER_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="h-50">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-50">
              {isSubmitting ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
