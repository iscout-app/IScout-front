import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IndividualReportTab } from './components/IndividualReportTab'
import { CollectiveReportTab } from './components/CollectiveReportTab'

export default function Reports() {
  const [activeTab, setActiveTab] = useState('individual')

  return (
    <div className="space-y-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="mt-8 text-muted-foreground">
          Gerar relatórios individuais e coletivos com exportação para PDF
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="individual">Relatórios Individuais</TabsTrigger>
          <TabsTrigger value="collective">Relatórios Coletivos</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-24">
          <IndividualReportTab />
        </TabsContent>

        <TabsContent value="collective" className="mt-24">
          <CollectiveReportTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
