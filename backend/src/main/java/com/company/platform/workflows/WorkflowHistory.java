package com.company.platform.workflows;



import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class WorkflowHistory {

    @Id @GeneratedValue
    private Long id;

    private String fromStatus;
    private String toStatus;
    private LocalDateTime changedAt;
}
