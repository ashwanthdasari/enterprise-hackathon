package com.company.platform.config;

import com.company.platform.users.Role;
import com.company.platform.users.User;
import com.company.platform.users.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123")); // Secure password
                admin.setRole(Role.ADMIN);
                admin.setActive(true);
                userRepository.save(admin);
                System.out.println("✅ Generated Admin User: admin@example.com / admin123");
            }
        };
    }
}
