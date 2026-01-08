package com.company.platform.workflow;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkflowSchedulerService {

    private final WorkflowRepository workflowRepository;

    public WorkflowSchedulerService(WorkflowRepository workflowRepository) {
        this.workflowRepository = workflowRepository;
    }

    /**
     * Automatically complete approved workflows after 1 day
     * Runs every day at midnight (00:00)
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void autoCompleteApprovedWorkflows() {
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);

        List<Workflow> approvedWorkflows = workflowRepository.findAll().stream()
                .filter(w -> w.getStatus() == WorkflowStatus.APPROVED)
                .filter(w -> w.getUpdatedAt() != null && w.getUpdatedAt().isBefore(oneDayAgo))
                .toList();

        if (!approvedWorkflows.isEmpty()) {
            approvedWorkflows.forEach(workflow -> {
                workflow.setStatus(WorkflowStatus.COMPLETED);
                // updatedAt is automatically set by @PreUpdate in Workflow entity
            });

            workflowRepository.saveAll(approvedWorkflows);
            System.out.println("Auto-completed " + approvedWorkflows.size() + " workflows");
        }
    }
}
