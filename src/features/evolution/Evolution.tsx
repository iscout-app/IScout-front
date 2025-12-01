import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Evolution() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evolução do Atleta</h1>
        <p className="mt-2 text-muted-foreground">Gráficos de evolução de desempenho</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada com gráficos Chart.js de evolução.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
