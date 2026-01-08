package com.company.platform.dashboard;

import java.util.Map;

public record DashboardStatsDTO(
        long totalUsers,
        long totalWorkflows,
        long pendingReviews,
        long activeProjects,
        Map<String, Long> statusDistribution,
        Map<String, Long> departmentDistribution,
        Map<String, Long> monthlyGrowth) {
}
