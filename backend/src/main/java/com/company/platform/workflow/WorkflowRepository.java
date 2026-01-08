package com.company.platform.workflow;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkflowRepository extends JpaRepository<Workflow, Long> {
    List<Workflow> findByCreatedBy_Id(Long userId);
}
