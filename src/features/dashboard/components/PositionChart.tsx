import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PositionDistribution } from '../types/dashboard.types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PositionChartProps {
  data: PositionDistribution[]
}

const POSITION_COLORS = {
  Goleiro: 'rgb(20, 184, 166)',       // Teal-500 (cor primária)
  Zagueiro: 'rgb(59, 130, 246)',      // Azul
  'Lateral Direito': 'rgb(168, 85, 247)', // Roxo
  'Lateral Esquerdo': 'rgb(236, 72, 153)', // Rosa vibrante
  Volante: 'rgb(251, 146, 60)',       // Laranja
  'Meio-Campo': 'rgb(34, 197, 94)',   // Verde
  Meia: 'rgb(14, 165, 233)',          // Azul céu
  'Meia-Atacante': 'rgb(244, 114, 182)', // Rosa claro
  Atacante: 'rgb(239, 68, 68)',       // Vermelho
  Ponta: 'rgb(234, 179, 8)',          // Amarelo
  'Ponta-Direita': 'rgb(139, 92, 246)', // Violeta
  'Ponta-Esquerda': 'rgb(6, 182, 212)', // Ciano
  Centroavante: 'rgb(220, 38, 38)',   // Vermelho escuro
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
            return chart.data.labels?.map((label, i) => ({
              text: `${label}`,
              fillStyle: datasets[0].backgroundColor?.[i] as string,
              hidden: false,
              index: i,
            })) || []
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
          label: (context) => {
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
