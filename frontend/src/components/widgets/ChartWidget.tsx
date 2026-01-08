import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData, ChartType } from '@/types/dashboard.types';

interface ChartWidgetProps {
  title: string;
  type: ChartType;
  data?: ChartData;
  isLoading?: boolean;
}

export const ChartWidget = ({ title, type, data, isLoading }: ChartWidgetProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const chartData = data.labels.map((label, index) => {
    const point: Record<string, string | number> = { name: label };
    data.datasets.forEach((dataset) => {
      point[dataset.label] = dataset.data[index];
    });
    return point;
  });

  const renderChart = () => {
    switch (type) {
      case ChartType.LINE:
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.datasets.map((dataset, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.borderColor || `hsl(${index * 137}, 70%, 50%)`}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );

      case ChartType.BAR:
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.datasets.map((dataset, index) => (
              <Bar
                key={index}
                dataKey={dataset.label}
                fill={
                  Array.isArray(dataset.backgroundColor)
                    ? dataset.backgroundColor[0]
                    : dataset.backgroundColor || `hsl(${index * 137}, 70%, 50%)`
                }
              />
            ))}
          </BarChart>
        );

      case ChartType.AREA:
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.datasets.map((dataset, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.borderColor || `hsl(${index * 137}, 70%, 50%)`}
                fill={
                  Array.isArray(dataset.backgroundColor)
                    ? dataset.backgroundColor[0]
                    : dataset.backgroundColor || `hsl(${index * 137}, 70%, 50%)`
                }
              />
            ))}
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: 'rgba(255, 253, 208, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
