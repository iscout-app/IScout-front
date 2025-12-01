import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PositionDistribution } from '../types/dashboard.types'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PositionChartProps {
  data: PositionDistribution[]
}

const POSITION_COLORS = {
  Goleiro: 'rgb(255, 99, 132)',
  Zagueiro: 'rgb(54, 162, 235)',
  'Lateral Direito': 'rgb(255, 206, 86)',
  'Lateral Esquerdo': 'rgb(75, 192, 192)',
  Volante: 'rgb(153, 102, 255)',
  'Meio-Campo': 'rgb(255, 159, 64)',
  Atacante: 'rgb(33, 128, 141)',
  Ponta: 'rgb(201, 203, 207)',
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
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 12,
          font: {
            size: 11,
            family: "'Inter', -apple-system, sans-serif",
          },
          generateLabels: (chart: ChartJS) => {
            const datasets = chart.data.datasets
            return chart.data.labels?.map((label, i) => ({
              text: `${label} (${datasets[0].data[i]})`,
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
        <CardTitle className="text-base">Distribuição por Posição</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
