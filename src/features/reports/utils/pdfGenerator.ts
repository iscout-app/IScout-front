import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { PlayerReportData } from '../types/reports.types'
import { calculateAge, formatDate, formatNumber } from './reportAggregator'

/**
 * Generate individual player report PDF
 */
export function generateIndividualReportPDF(report: PlayerReportData): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Relatório Individual de Jogador', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Player Header
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  const age = calculateAge(report.birthdate)
  doc.text(`Nome: ${report.name}`, 20, yPosition)
  yPosition += 7
  doc.text(`Posição: ${report.position} | Camisa: ${report.shirtNumber} | Idade: ${age} anos`, 20, yPosition)
  yPosition += 7
  doc.text(`Data de Nascimento: ${formatDate(report.birthdate)}`, 20, yPosition)
  yPosition += 12

  // Summary Statistics Table
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumo Estatístico', 20, yPosition)
  yPosition += 7

  autoTable(doc, {
    startY: yPosition,
    head: [['Métrica', 'Valor']],
    body: [
      ['Total de Partidas', report.totalMatches.toString()],
      ['Total de Gols', report.totalGoals.toString()],
      ['Total de Assistências', report.totalAssists.toString()],
      ['Média de Desempenho', formatNumber(report.averageRating, 1)],
      ['Gols por Partida', formatNumber(report.goalsPerMatch, 2)],
      ['Assistências por Partida', formatNumber(report.assistsPerMatch, 2)],
      ['Precisão de Passes', `${formatNumber(report.passAccuracy, 1)}%`],
      ['Desarmes por Partida', formatNumber(report.tacklesPerMatch, 2)],
      ['Interceptações por Partida', formatNumber(report.interceptionsPerMatch, 2)],
      ['Cartões Amarelos', report.totalYellowCards.toString()],
      ['Cartões Vermelhos', report.totalRedCards.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 20, right: 20 },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // Evolution Data (if we're not too far down the page)
  if (yPosition < 240 && report.evolution.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Últimas Performances', 20, yPosition)
    yPosition += 7

    const evolutionData = report.evolution.slice(-10).map((e) => [
      formatDate(e.date),
      e.goals.toString(),
      e.assists.toString(),
      formatNumber(e.rating, 1),
      e.yellowCards.toString(),
      e.redCards.toString(),
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [['Data', 'Gols', 'Assist.', 'Nota', 'CA', 'CV']],
      body: evolutionData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 },
    })
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')} - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // Download PDF
  doc.save(`relatorio_${report.name.toLowerCase().replace(/\s+/g, '_')}.pdf`)
}

/**
 * Generate collective (comparative) report PDF for multiple players
 */
export function generateCollectiveReportPDF(reports: PlayerReportData[]): void {
  const doc = new jsPDF('landscape') // Landscape for better table view
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Relatório Coletivo - Comparativo de Jogadores', pageWidth / 2, yPosition, {
    align: 'center',
  })
  yPosition += 12

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total de Jogadores: ${reports.length}`, pageWidth / 2, yPosition, {
    align: 'center',
  })
  yPosition += 15

  // Comparative Table
  const tableData = reports.map((r) => [
    r.name,
    r.position,
    r.totalMatches.toString(),
    r.totalGoals.toString(),
    r.totalAssists.toString(),
    formatNumber(r.averageRating, 1),
    formatNumber(r.goalsPerMatch, 2),
    formatNumber(r.assistsPerMatch, 2),
    `${formatNumber(r.passAccuracy, 1)}%`,
    r.totalYellowCards.toString(),
    r.totalRedCards.toString(),
  ])

  autoTable(doc, {
    startY: yPosition,
    head: [
      [
        'Nome',
        'Posição',
        'Partidas',
        'Gols',
        'Assist.',
        'Média',
        'Gols/P',
        'Assist./P',
        'Passe%',
        'CA',
        'CV',
      ],
    ],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], fontSize: 9 },
    styles: { fontSize: 8 },
    margin: { left: 10, right: 10 },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // Add new page for individual summaries if needed
  if (yPosition > 170) {
    doc.addPage()
    yPosition = 20
  }

  // Top Performers Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Destaques', 20, yPosition)
  yPosition += 10

  // Find top performers
  const topScorer = reports.reduce((prev, curr) =>
    curr.totalGoals > prev.totalGoals ? curr : prev
  )
  const topAssister = reports.reduce((prev, curr) =>
    curr.totalAssists > prev.totalAssists ? curr : prev
  )
  const bestRating = reports.reduce((prev, curr) =>
    curr.averageRating > prev.averageRating ? curr : prev
  )
  const mostDisciplined = reports.reduce((prev, curr) =>
    curr.totalYellowCards + curr.totalRedCards <
    prev.totalYellowCards + prev.totalRedCards
      ? curr
      : prev
  )

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Artilheiro: ${topScorer.name} (${topScorer.totalGoals} gols)`, 20, yPosition)
  yPosition += 7
  doc.text(
    `Maior Assistente: ${topAssister.name} (${topAssister.totalAssists} assistências)`,
    20,
    yPosition
  )
  yPosition += 7
  doc.text(
    `Melhor Média: ${bestRating.name} (${formatNumber(bestRating.averageRating, 1)})`,
    20,
    yPosition
  )
  yPosition += 7
  doc.text(
    `Mais Disciplinado: ${mostDisciplined.name} (${mostDisciplined.totalYellowCards + mostDisciplined.totalRedCards} cartões)`,
    20,
    yPosition
  )

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')} - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  // Download PDF
  const timestamp = new Date().getTime()
  doc.save(`relatorio_coletivo_${timestamp}.pdf`)
}
