import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CategoryPerformance } from '../types/dashboard.types'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface CategoryChartProps {
  data: CategoryPerformance[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        label: 'Média de Desempenho',
        data: data.map((item) => item.averageRating),
        backgroundColor: 'rgba(100, 100, 100, 0.7)',
        borderColor: 'rgba(100, 100, 100, 0.9)',
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
          label: (context: any) => `Média: ${context.parsed.y.toFixed(1)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 2,
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Desempenho por Categoria</CardTitle>
        <p className="text-sm text-muted-foreground">Média de notas</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
