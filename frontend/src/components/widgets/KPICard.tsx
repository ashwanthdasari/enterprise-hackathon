import { Card, CardContent, Typography, Box, Skeleton, alpha, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { KPIData } from '@/types/dashboard.types';

interface KPICardProps {
  data?: KPIData;
  isLoading?: boolean;
}

export const KPICard = ({ data, isLoading }: KPICardProps) => {
  const theme = useTheme();
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="30%" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const getTrendIcon = () => {
    if (!data.trend) return null;
    switch (data.trendDirection) {
      case 'up':
        return <TrendingUp fontSize="small" color="success" />;
      case 'down':
        return <TrendingDown fontSize="small" color="error" />;
      default:
        return <TrendingFlat fontSize="small" color="disabled" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trendDirection) {
      case 'up':
        return 'success.main';
      case 'down':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        background: 'rgba(255, 253, 208, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
          {data.label}
        </Typography>
        <Typography variant="h3" component="div" sx={{ my: 1, fontWeight: 800, color: 'primary.main' }}>
          {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
        </Typography>
        {data.trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: alpha(data.trend > 0 ? theme.palette.success.main : theme.palette.error.main, 0.1),
                px: 1,
                py: 0.5,
                borderRadius: 2
              }}
            >
              {getTrendIcon()}
              <Typography variant="caption" sx={{ color: getTrendColor(), fontWeight: 700, ml: 0.5 }}>
                {data.trend > 0 ? '+' : ''}
                {data.trend}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
