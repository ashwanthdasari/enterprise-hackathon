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

        Map<String, Long> statusDistribution = allWorkflows.stream()
                .collect(Collectors.groupingBy(
                        w -> w.getStatus().name(),
                        Collectors.counting()));

        // Ensure all statuses are present in the map, even if count is 0
        for (WorkflowStatus status : WorkflowStatus.values()) {
            statusDistribution.putIfAbsent(status.name(), 0L);
        }

        return new DashboardStatsDTO(totalUsers, totalWorkflows, pendingReviews, statusDistribution);
    }
}
