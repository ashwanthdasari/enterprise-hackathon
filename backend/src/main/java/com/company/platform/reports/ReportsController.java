package com.company.platform.reports;

import com.company.platform.users.UserRepository;
import com.company.platform.workflow.WorkflowRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final UserRepository userRepository;
    private final WorkflowRepository workflowRepository;

    public ReportsController(UserRepository userRepository, WorkflowRepository workflowRepository) {
        this.userRepository = userRepository;
        this.workflowRepository = workflowRepository;
    }

    @GetMapping("/users/csv")
    public void exportUsers(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"users.csv\"");

        List<String[]> rows = new ArrayList<>();
        rows.add(new String[] { "ID", "Email", "First Name", "Last Name", "Role", "Active" });

        userRepository.findAll().forEach(user -> {
            rows.add(new String[] {
                    String.valueOf(user.getId()),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRole().name(),
                    String.valueOf(user.isActive())
            });
        });

        try (PrintWriter writer = response.getWriter()) {
            writer.write(CsvUtil.toCsv(rows));
        }
    }

    @GetMapping("/workflows/csv")
    public void exportWorkflows(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"workflows.csv\"");

        List<String[]> rows = new ArrayList<>();
        rows.add(new String[] { "ID", "Description", "Status", "Creator", "Created At" });

        workflowRepository.findAll().forEach(wf -> {
            rows.add(new String[] {
                    String.valueOf(wf.getId()),
                    "\"" + wf.getDescription().replace("\"", "\"\"") + "\"", // Escape quotes
                    wf.getStatus().name(),
                    wf.getCreatedBy().getEmail(),
                    wf.getCreatedAt().toString()
            });
        });

        try (PrintWriter writer = response.getWriter()) {
            writer.write(CsvUtil.toCsv(rows));
        }
    }
}
