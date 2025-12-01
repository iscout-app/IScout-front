import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="mt-2 text-muted-foreground">Gerar relatórios individuais e coletivos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada com sistema de geração de relatórios.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
