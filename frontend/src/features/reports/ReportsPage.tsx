import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Stack,
    useTheme,
    alpha,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Download as DownloadIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from 'recharts';



const COLORS = ['#002D62', '#2E8B57', '#D32F2F', '#ED6C02', '#F4C430', '#800080'];
import { reportsService } from '@/services/reportsService';
import { useGetDashboardStatsQuery } from '@/store/api/dashboardApi';
import { CircularProgress } from '@mui/material';

export const ReportsPage = () => {
    const theme = useTheme();
    const [timeRange, setTimeRange] = useState('6m');
    const { data: stats, isLoading } = useGetDashboardStatsQuery();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Transform Data for Charts
    const pieData = stats?.statusDistribution
        ? Object.entries(stats.statusDistribution).map(([name, value]) => ({ name, value }))
        : [];

    const barData = stats?.departmentDistribution
        ? Object.entries(stats.departmentDistribution).map(([name, count]) => ({ name, workflows: count }))
        : [];

    const areaData = stats?.monthlyGrowth
        ? Object.entries(stats.monthlyGrowth).map(([name, count]) => ({ name, workflows: count }))
        // Sort months? For now, backend sends them strings, simpler to rely on backend sorting broadly or accept unsorted
        : [];


    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                        Analytics & Reports
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Visualize system performance and workflow efficiency.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{ borderRadius: 3, px: 3 }}
                        onClick={() => reportsService.exportUsers()}
                    >
                        Export Users
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        sx={{
                            borderRadius: 3,
                            px: 3,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        }}
                        onClick={() => reportsService.exportWorkflows()}
                    >
                        Export Workflows
                    </Button>
                </Stack>
            </Box>

            {/* Filters Row */}
            <Paper sx={{ p: 2, borderRadius: 4, mb: 3, display: 'flex', gap: 2, alignItems: 'center', bgcolor: alpha(theme.palette.background.paper, 0.8) }}>
                <FilterIcon color="action" />
                <Typography variant="subtitle2" fontWeight={600}>Quick Filters:</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeRange}
                        label="Time Range"
                        onChange={(e) => setTimeRange(e.target.value)}
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="1m">Last Month</MenuItem>
                        <MenuItem value="6m">Last 6 Months</MenuItem>
                        <MenuItem value="1y">Last Year</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            {/* Main Content Layout */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Left Column: Pie Chart */}
                <Box sx={{ width: { xs: '100%', md: '40%' }, minWidth: 0 }}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: 750, background: 'rgba(255, 253, 208, 0.5)', backdropFilter: 'blur(10px)' }}>
                        {pieData.length > 0 && pieData.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={100}
                                        outerRadius={140}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.6 }}>
                                <Typography variant="body1" fontWeight={500}>No status data</Typography>
                                <Typography variant="caption">Create workflows to see status distribution.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>

                {/* Right Column: Stacked Charts */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 58.33%' }, minWidth: 0 }}>
                    <Stack spacing={3}>
                        <Paper sx={{ p: 3, borderRadius: 4, height: 360, background: 'rgba(255, 253, 208, 0.5)', backdropFilter: 'blur(10px)' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                Workflow Activity Growth (Monthly)
                            </Typography>
                            {areaData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="85%">
                                    <AreaChart data={areaData}>
                                        <defs>
                                            <linearGradient id="colorWorkflows" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                backgroundColor: '#FFFDD0'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="workflows"
                                            stroke={theme.palette.primary.main}
                                            fillOpacity={1}
                                            fill="url(#colorWorkflows)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.6 }}>
                                    <Typography variant="body1" fontWeight={500}>No activity data available</Typography>
                                    <Typography variant="caption">Start creating workflows to see activity trends.</Typography>
                                </Box>
                            )}
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 4, height: 360, background: 'rgba(255, 253, 208, 0.5)', backdropFilter: 'blur(10px)' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                Workflows by Department
                            </Typography>
                            {barData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="85%">
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="workflows" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.6 }}>
                                    <Typography variant="body1" fontWeight={500}>No department data available</Typography>
                                    <Typography variant="caption">Update user profiles to see department stats.</Typography>
                                </Box>
                            )}
                        </Paper>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};
