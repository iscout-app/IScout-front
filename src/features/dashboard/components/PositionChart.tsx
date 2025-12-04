import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PositionDistribution } from '../types/dashboard.types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PositionChartProps {
  data: PositionDistribution[]
}


const POSITION_COLORS: Record<string, string> = {
  "goleiro": 'rgb(20, 184, 166)',    // Teal-500 (cor primária)
  "Goleiro": 'rgb(20, 184, 166)',    // Teal-500 (alternativa capitalizada)
  "zagueiro": 'rgb(59, 130, 246)',   // Azul
  "Zagueiro": 'rgb(59, 130, 246)',   // Azul (alternativa capitalizada)
  "lateral": 'rgb(168, 85, 247)',    // Roxo
  "Lateral": 'rgb(168, 85, 247)',    // Roxo (alternativa capitalizada)
  "volante": 'rgb(251, 146, 60)',    // Laranja
  "Volante": 'rgb(251, 146, 60)',    // Laranja (alternativa capitalizada)
  "meia": 'rgb(34, 197, 94)',        // Verde
  "Meia": 'rgb(34, 197, 94)',        // Verde (alternativa capitalizada)
  "atacante": 'rgb(239, 68, 68)',    // Vermelho
  "Atacante": 'rgb(239, 68, 68)',    // Vermelho (alternativa capitalizada)
}

export function PositionChart({ data }: PositionChartProps) {
  const chartData = {
    labels: data.map((item) => item.position),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: data.map(
          (item) => POSITION_COLORS[item.position as keyof typeof POSITION_COLORS] || 'rgb(156, 163, 175)'
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
            family: "'Inter', -apple-system, sans-serif",
          },
          generateLabels: (chart: ChartJS) => {
            const datasets = chart.data.datasets
            return chart.data.labels?.map((label, i) => {
              const bgColor = datasets[0].backgroundColor
              const color = Array.isArray(bgColor) ? bgColor[i] : bgColor
              return {
                text: `${label}`,
                fillStyle: color as string,
                hidden: false,
                index: i,
              }
            }) || []
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed} (${percentage}%)`
          },
        },
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Jogadores por Posição</CardTitle>
        <p className="text-sm text-muted-foreground">Distribuição atual</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
