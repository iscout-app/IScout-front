import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data)
      toast.success('Login realizado com sucesso!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login')
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

      {/* Login Card */}
      <div className="bg-surface rounded-lg border border-border shadow-md p-32">
        {/* Login Header */}
        <div className="text-center mb-32">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            Bem-vindo
          </h2>
          <p className="text-base text-muted-foreground">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="Digite sua senha"
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

          {/* Form Options */}
          <div className="flex items-center justify-between mb-24 text-sm">
            <div className="flex items-center gap-8">
              <input
                type="checkbox"
                id="rememberMe"
                className="w-4 h-4 cursor-pointer accent-primary"
              />
              <label htmlFor="rememberMe" className="text-foreground cursor-pointer select-none">
                Lembrar-me
              </label>
            </div>
            <a href="#" className="text-primary font-medium hover:text-primary-hover transition-colors duration-fast">
              Esqueceu a senha?
            </a>
          </div>

          <Button type="submit" className="w-full h-100" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center mt-24 text-sm text-muted-foreground">
          Escola Oficial do Flamengo - Arapiraca
        </p>
      </div>
    </div>
   </div>
  )
}
