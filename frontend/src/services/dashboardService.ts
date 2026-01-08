import api from './api';

export interface DashboardStats {
    totalUsers: number;
    totalWorkflows: number;
    pendingReviews: number;
    statusDistribution: Record<string, number>;
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>('/dashboard/stats');
        return response.data;
    },
};
