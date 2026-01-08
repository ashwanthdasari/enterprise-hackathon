package com.company.platform.dashboard;

import java.util.Map;

public record DashboardStatsDTO(
        long totalUsers,
        long totalWorkflows,
        long pendingReviews,
        Map<String, Long> statusDistribution) {
}
