package com.company.platform.config;

import com.company.platform.users.Role;
import com.company.platform.users.User;
import com.company.platform.users.UserRepository;
import com.company.platform.workflow.WorkflowRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, WorkflowRepository workflowRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // CRITICAL: Clean up corrupted state caused by duplicates/schema issues
            try {
                workflowRepository.deleteAll();
                userRepository.deleteAll();
                System.out.println("✅ Cleaned up existing database data to prevent conflicts.");
            } catch (Exception e) {
                System.out.println("⚠️ Warning: Could not clean up database. Proceeding anyway. " + e.getMessage());
            }

            createOrUpdateUser(userRepository, passwordEncoder, "admin@example.com", "admin123", Role.ADMIN, "Admin",
                    "User", "IT");
            createOrUpdateUser(userRepository, passwordEncoder, "manager@example.com", "manager123", Role.MANAGER,
                    "Manager", "User", "Operations");
            createOrUpdateUser(userRepository, passwordEncoder, "reviewer@example.com", "reviewer123", Role.REVIEWER,
                    "Reviewer", "User", "Legal");
            createOrUpdateUser(userRepository, passwordEncoder, "viewer@example.com", "viewer123", Role.VIEWER,
                    "Viewer", "User", "HR");
            System.out.println("✅ Demo Users Initialized: Admin, Manager, Reviewer, Viewer");
        };
    }

    private void createOrUpdateUser(UserRepository repo, PasswordEncoder encoder, String email, String password,
            Role role, String first, String last, String department) {
        // Since we deleted all, we can just create new.
        // But keeping safety check just in case.
        if (repo.findByEmail(email).isPresent()) {
            return;
        }

        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setRole(role);
        user.setFirstName(first);
        user.setLastName(last);
        user.setDepartment(department); // Set department
        user.setActive(true);
        user.setDeleted(false);

        repo.save(user);
    }
}
