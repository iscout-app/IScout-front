import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useIsAdmin } from '@/lib/rbac/hooks'

export default function Users() {
  const isAdmin = useIsAdmin()

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Apenas administradores podem acessar esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
        <p className="mt-2 text-muted-foreground">CRUD de usuários do sistema (Admin)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada com tabela de usuários e CRUD completo.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
