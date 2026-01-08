package com.company.platform.config;

import com.company.platform.users.Role;
import com.company.platform.users.User;
import com.company.platform.users.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUser("admin", "admin@example.com", "Admin", "User", "admin123", Role.ADMIN);
        seedUser("manager", "manager@example.com", "Manager", "User", "manager123", Role.MANAGER);
        seedUser("reviewer", "reviewer@example.com", "Reviewer", "User", "reviewer123", Role.REVIEWER);
        seedUser("viewer", "viewer@example.com", "Viewer", "User", "viewer123", Role.VIEWER);
    }

    private void seedUser(String username, String email, String firstName, String lastName, String password, Role role) {
        User user = userRepository.findByEmail(email).orElse(new User());
        user.setEmail(email);
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setActive(true);
        user.setDeleted(false);
        userRepository.save(user);
        System.out.println("Seeded user: " + email + " / " + password);
    }
}
