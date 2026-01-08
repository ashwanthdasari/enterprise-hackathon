package com.company.platform.workflow;

import com.company.platform.auth.UserDTO;
import com.company.platform.common.BusinessException;
import com.company.platform.users.Role;
import com.company.platform.users.User;
import com.company.platform.users.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final UserRepository userRepository;

    public WorkflowService(WorkflowRepository workflowRepository, UserRepository userRepository) {
        this.workflowRepository = workflowRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public WorkflowDTO createWorkflow(CreateWorkflowRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found: " + username));

        Workflow workflow = new Workflow();
        workflow.setTitle(request.title());
        workflow.setDescription(request.description());
        workflow.setPriority(request.priority());
        workflow.setCategory(request.category());
        workflow.setStatus(WorkflowStatus.DRAFT);
        workflow.setCreatedBy(user);

        Workflow saved = workflowRepository.save(workflow);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<WorkflowDTO> getWorkflows(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        List<Workflow> workflows;
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER || user.getRole() == Role.REVIEWER) {
            workflows = workflowRepository.findAll();
        } else {
            workflows = workflowRepository.findByCreatedBy_Id(user.getId());
        }

        return workflows.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public WorkflowDTO updateStatus(Long id, String status, String username) {
        // First, check if the user exists and has permission (e.g., is an admin,
        // manager, or the creator)
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Workflow not found"));

        // Basic permission check: only creator, admin, manager, or reviewer can update
        // status
        boolean hasPermission = currentUser.getId().equals(workflow.getCreatedBy().getId()) ||
                currentUser.getRole() == Role.ADMIN ||
                currentUser.getRole() == Role.MANAGER ||
                currentUser.getRole() == Role.REVIEWER;

        if (!hasPermission) {
            throw new BusinessException("User does not have permission to update this workflow's status.");
        }

        try {
            WorkflowStatus newStatus = WorkflowStatus.valueOf(status.toUpperCase()); // Ensure status is uppercase for
                                                                                     // enum matching
            workflow.setStatus(newStatus);
            Workflow saved = workflowRepository.save(workflow);
            return mapToDTO(saved);
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid status: " + status + ". Valid statuses are: "
                    + java.util.Arrays.toString(WorkflowStatus.values()));
        }
    }

    private WorkflowDTO mapToDTO(Workflow w) {
        User u = w.getCreatedBy();
        UserDTO userDto = new UserDTO(
                u.getId().toString(),
                u.getEmail(),
                u.getFirstName(),
                u.getLastName(),
                u.getRole(),
                null,
                null,
                u.getCreatedAt().toString(),
                u.getUpdatedAt().toString());

        return new WorkflowDTO(
                w.getId().toString(),
                w.getTitle(),
                w.getDescription(),
                w.getStatus().name(),
                w.getPriority(),
                w.getCategory(),
                userDto,
                w.getCreatedAt().toString(),
                w.getUpdatedAt().toString());
    }
}
