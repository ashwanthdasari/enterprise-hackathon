package com.company.platform.workflow;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowService service;

    public WorkflowController(WorkflowService service) {
        this.service = service;
    }

    @GetMapping
    public List<WorkflowDTO> getWorkflows(Authentication authentication) {
        // In real app, authentication principal would be UserDetails.
        // For now, assuming username is the principal or name.
        return service.getWorkflows(authentication.getName());
    }

    @PostMapping
    public WorkflowDTO createWorkflow(@RequestBody CreateWorkflowRequest request, Authentication authentication) {
        return service.createWorkflow(request, authentication.getName());
    }

    @PatchMapping("/{id}/status")
    public WorkflowDTO updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body,
            Authentication authentication) {
        String status = body.get("status");
        return service.updateStatus(id, status, authentication.getName());
    }
}
