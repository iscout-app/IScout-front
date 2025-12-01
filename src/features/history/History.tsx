import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function History() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Desempenho</h1>
        <p className="mt-2 text-muted-foreground">Timeline de eventos dos jogadores</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada com timeline de eventos.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
