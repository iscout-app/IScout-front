import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '../api/authApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Nome muito longo'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string().min(8, 'Confirmação de senha obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      toast.success('Conta criada com sucesso! Faça login para continuar.')
      navigate('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-20 bg-background">
      <div className="w-full max-w-[420px]">
        {/* Logo Section */}
        <div className="text-center mb-48">
          <div className="w-16 h-16 mx-auto mb-16 flex items-center justify-center text-3xl font-bold text-white rounded-xl shadow-lg bg-green-600">
            ⚽
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-8 tracking-tight">
            IScout
          </h1>
          <p className="text-base font-normal text-muted-foreground">
            Sistema de Scout de Jovens Jogadores
          </p>
        </div>

      {/* Register Card */}
      <div className="bg-surface rounded-lg border border-border shadow-md p-32">
        {/* Register Header */}
        <div className="text-center mb-32">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            Criar Conta
          </h2>
          <p className="text-base text-muted-foreground">
            Preencha os dados abaixo para criar sua conta
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="mb-20">
            <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-8">
              Nome Completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              {...register('name')}
              disabled={isLoading}
              className="w-full h-100"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-4">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-20">
            <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-8">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              disabled={isLoading}
              className="w-full h-100"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-4">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-20">
            <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-8">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register('password')}
              disabled={isLoading}
              className="w-full h-100"
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-4">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-24">
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-8">
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              {...register('confirmPassword')}
              disabled={isLoading}
              className="w-full h-100"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive mt-4">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full h-100" disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        {/* Footer - Link to Login */}
        <p className="text-center mt-24 text-sm text-foreground">
          Já tem uma conta?{' '}
          <a
            href="/login"
            className="text-primary font-medium hover:text-primary-hover transition-colors duration-fast"
          >
            Fazer login
          </a>
        </p>
      </div>
    </div>
   </div>
  )
}
