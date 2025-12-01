import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PlayersList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jogadores</h1>
        <p className="mt-2 text-muted-foreground">Lista de jogadores cadastrados</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada com a listagem de jogadores, filtros e cards.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
