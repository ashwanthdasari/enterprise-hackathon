import { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
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

const data = [
    { name: 'Jan', workflows: 400, users: 240, amt: 2400 },
    { name: 'Feb', workflows: 300, users: 139, amt: 2210 },
    { name: 'Mar', workflows: 200, users: 980, amt: 2290 },
    { name: 'Apr', workflows: 278, users: 390, amt: 2000 },
    { name: 'May', workflows: 189, users: 480, amt: 2181 },
    { name: 'Jun', workflows: 239, users: 380, amt: 2500 },
    { name: 'Jul', workflows: 349, users: 430, amt: 2100 },
];

const pieData = [
    { name: 'Completed', value: 400 },
    { name: 'Pending', value: 300 },
    { name: 'Rejected', value: 300 },
    { name: 'In Review', value: 200 },
];

const COLORS = ['#002D62', '#2E8B57', '#D32F2F', '#ED6C02'];
import { reportsService } from '@/services/reportsService';

export const ReportsPage = () => {
    const theme = useTheme();
    const [timeRange, setTimeRange] = useState('6m');

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

            <Grid container spacing={3}>
                {/* Filters Row */}
                <Grid xs={12}>
                    <Paper sx={{ p: 2, borderRadius: 4, display: 'flex', gap: 2, alignItems: 'center', bgcolor: alpha(theme.palette.background.paper, 0.8) }}>
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
                </Grid>

                {/* Main Chart */}
                <Grid xs={12} lg={8}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: 450, background: 'rgba(255, 253, 208, 0.5)', backdropFilter: 'blur(10px)' }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                            Workflow Activity Growth
                        </Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorWorkflows" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
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
                    </Paper>
                </Grid>

                {/* Pie Chart */}
                <Grid xs={12} lg={4}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: 450, background: 'rgba(255, 253, 208, 0.5)', backdropFilter: 'blur(10px)' }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                            Status Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height="70%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Overall efficiency is up by <span style={{ color: theme.palette.success.main, fontWeight: 700 }}>12.5%</span> this month.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Bar Chart */}
                <Grid xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: 400, background: 'rgba(255, 253, 208, 0.5)', backdropFilter: 'blur(10px)' }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                            Departmental Productivity
                        </Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="users" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="workflows" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
