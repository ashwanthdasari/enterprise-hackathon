package com.company.platform.workflow;

public record CreateWorkflowRequest(
    String title,
    String description,
    String priority,
    String category
) {}
