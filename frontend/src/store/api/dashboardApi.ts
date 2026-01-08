import { baseApi } from './baseApi';

export interface DashboardStats {
    totalUsers: number;
    totalWorkflows: number;
    pendingReviews: number;
    statusDistribution: Record<string, number>;
    departmentDistribution: Record<string, number>;
    monthlyGrowth: Record<string, number>;
}

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStats, void>({
            query: () => '/dashboard/stats',
            providesTags: ['Dashboard'],
        }),
    }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
