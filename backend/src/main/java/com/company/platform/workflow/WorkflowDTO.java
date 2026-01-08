package com.company.platform.workflow;

import com.company.platform.auth.UserDTO;

public record WorkflowDTO(
    String id,
    String title,
    String description,
    String status,
    String priority,
    String category,
    UserDTO createdBy,
    String createdAt,
    String updatedAt
) {}
