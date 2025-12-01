import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PlayerRegistration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Jogador</h1>
        <p className="mt-2 text-muted-foreground">Adicionar novo jogador ao sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada com o formulário de cadastro de jogadores.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
