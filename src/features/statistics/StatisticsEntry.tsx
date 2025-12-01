import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StatisticsEntry() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registrar Estatísticas</h1>
        <p className="mt-2 text-muted-foreground">Lançar estatísticas de treinos e partidas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada com formulário complexo de estatísticas.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
