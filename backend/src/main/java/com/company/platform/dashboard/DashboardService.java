package com.company.platform.dashboard;

import com.company.platform.users.UserRepository;
import com.company.platform.workflow.Workflow;
import com.company.platform.workflow.WorkflowRepository;
import com.company.platform.workflow.WorkflowStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

        private final UserRepository userRepository;
        private final WorkflowRepository workflowRepository;

        public DashboardService(UserRepository userRepository, WorkflowRepository workflowRepository) {
                this.userRepository = userRepository;
                this.workflowRepository = workflowRepository;
        }

        @Transactional(readOnly = true)
        public DashboardStatsDTO getStats() {
                long totalUsers = userRepository.count();
                long totalWorkflows = workflowRepository.count();

                // This could be optimized with a custom JPQL query for larger datasets
                List<Workflow> allWorkflows = workflowRepository.findAll();

                long pendingReviews = allWorkflows.stream()
                                .filter(w -> w.getStatus() == WorkflowStatus.IN_REVIEW)
                                .count();

                // Active projects: workflows currently being worked on (not terminal states)
                long activeProjects = allWorkflows.stream()
                                .filter(w -> w.getStatus() == WorkflowStatus.SUBMITTED
                                                || w.getStatus() == WorkflowStatus.IN_REVIEW
                                                || w.getStatus() == WorkflowStatus.REOPENED)
                                .count();

                // 1. Status Distribution
                Map<String, Long> statusDistribution = allWorkflows.stream()
                                .collect(Collectors.groupingBy(
                                                w -> w.getStatus().name(),
                                                Collectors.counting()));

                for (WorkflowStatus status : WorkflowStatus.values()) {
                        statusDistribution.putIfAbsent(status.name(), 0L);
                }

                // 2. Department Distribution (Bar Chart)
                Map<String, Long> departmentDistribution = allWorkflows.stream()
                                .filter(w -> w.getCreatedBy() != null && w.getCreatedBy().getDepartment() != null
                                                && !w.getCreatedBy().getDepartment().isEmpty())
                                .collect(Collectors.groupingBy(
                                                w -> w.getCreatedBy().getDepartment(),
                                                Collectors.counting()));

                // 3. Monthly Growth (Area Chart) - Last 12 months roughly or just by Month Name
                // Using concise lambda for Month name extraction
                Map<String, Long> monthlyGrowth = allWorkflows.stream()
                                .filter(w -> w.getCreatedAt() != null)
                                .collect(Collectors.groupingBy(
                                                w -> w.getCreatedAt().getMonth().name().substring(0, 3), // Jan, Feb...
                                                Collectors.counting()));

                // Ensure some months exist? (Optional, frontend handles missing keys usually)

                return new DashboardStatsDTO(totalUsers, totalWorkflows, pendingReviews, activeProjects,
                                statusDistribution, departmentDistribution, monthlyGrowth);
        }
}
