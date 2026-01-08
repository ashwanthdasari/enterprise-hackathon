import { Box, Typography, Skeleton, Stack, alpha, useTheme, Paper } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import { KPICard } from '@/components/widgets/KPICard';
import { ChartWidget } from '@/components/widgets/ChartWidget';
import { ChartType } from '@/types/dashboard.types';
import { useGetDashboardStatsQuery } from '@/store/api/dashboardApi';
import { UserRole } from '@/types/auth.types';

export const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  const isReviewerOrViewer = user?.role === UserRole.REVIEWER || user?.role === UserRole.VIEWER;

  const dashboardData = stats ? {
    kpis: [
      { label: 'Total Users', value: stats.totalUsers, trend: 12, trendDirection: 'up' as const },
      { label: 'Total Workflows', value: stats.totalWorkflows, trend: 5, trendDirection: 'up' as const },
      { label: 'Pending Reviews', value: stats.pendingReviews, trend: 0, trendDirection: 'neutral' as const },
      { label: 'Active Projects', value: stats.activeProjects, trend: 2, trendDirection: 'up' as const },
    ],
    charts: {
      workflowTrend: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Workflow Activity',
            data: [12, 19, 3, 5, 2, stats.totalWorkflows],
            borderColor: theme.palette.primary.main,
          },
        ],
      },
      statusDistribution: {
        labels: Object.keys(stats.statusDistribution),
        datasets: [
          {
            label: 'Count',
            data: Object.values(stats.statusDistribution),
            backgroundColor: ['#002D62', '#ED6C02', '#0288D1', '#2E8B57', '#D32F2F'],
          },
        ],
      }
    },
  } : null;

  if (!user) return null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" fontWeight={800} color="primary" gutterBottom>
        Welcome back, {user.firstName}!
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 6, fontWeight: 500 }}>
        {isReviewerOrViewer
          ? "Here's your personal overview of project activity."
          : "System-wide performance overview at a glance."}
      </Typography>

      <Stack spacing={4}>
        {/* KPI Cards Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3 }}>
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
              ))}
            </>
          ) : (
            dashboardData?.kpis.map((kpi, index) => (
              <KPICard key={index} data={kpi} />
            ))
          )}
        </Box>

        {/* Unified/Reviewer Content */}
        {isReviewerOrViewer && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { lg: '2fr 1fr' }, gap: 3 }}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
            ) : (
              <ChartWidget
                title="Personal Activity History"
                type={ChartType.AREA}
                data={dashboardData?.charts.workflowTrend}
              />
            )}
            {isLoading ? (
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
            ) : (
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'background.paper' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Recent Tasks</Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {[1, 2, 3].map((i) => (
                    <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), border: '1px solid rgba(0,0,0,0.05)' }}>
                      <Typography variant="subtitle2" fontWeight={600}>Workflow Update #{i}42</Typography>
                      <Typography variant="caption" color="text.secondary">Modified 2 hours ago</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}
          </Box>
        )}

        {/* Global/Admin Content */}
        {!isReviewerOrViewer && (
          <>
            <Box>
              {isLoading ? (
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
              ) : (
                <ChartWidget
                  title="System-wide Workflow Trends"
                  type={ChartType.LINE}
                  data={dashboardData?.charts.workflowTrend}
                />
              )}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: user?.role === UserRole.ADMIN ? '1fr 1fr' : '1fr', gap: 3 }}>
              {user?.role === UserRole.ADMIN && (
                <Box>
                  {isLoading ? (
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
                  ) : (
                    <ChartWidget
                      title="Status Distribution"
                      type={ChartType.BAR}
                      data={dashboardData?.charts.statusDistribution || { labels: [], datasets: [] }}
                    />
                  )}
                </Box>
              )}

              {(user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER) && (
                <Box>
                  {isLoading ? (
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
                  ) : (
                    <ChartWidget
                      title="Productivity Matrix"
                      type={ChartType.AREA}
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [
                          {
                            label: 'Efficiency',
                            data: [30, 45, 38, 52, 48, 61],
                            borderColor: theme.palette.secondary.main,
                            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                          },
                        ],
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
};
