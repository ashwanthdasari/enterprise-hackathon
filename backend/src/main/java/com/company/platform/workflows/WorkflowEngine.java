package com.company.platform.workflows;



import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class WorkflowEngine {

    private static final Map<String, Set<String>> FLOW = Map.of(
            "CREATED", Set.of("REVIEW"),
            "REVIEW", Set.of("APPROVED", "REJECTED"),
            "REJECTED", Set.of("REOPENED")
    );

    public void validate(String from, String to) {
        if (!FLOW.getOrDefault(from, Set.of()).contains(to)) {
            throw new RuntimeException("Invalid workflow transition");
        }
    }
}
