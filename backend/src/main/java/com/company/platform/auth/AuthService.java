package com.company.platform.auth;

import com.company.platform.auth.LoginRequest;
import com.company.platform.common.BusinessException;
import com.company.platform.security.JwtUtil;
import com.company.platform.users.Role;
import com.company.platform.users.User;
import com.company.platform.users.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("Invalid email or password"));

        if (!user.isActive()) {
            throw new BusinessException("User account is inactive");
        }

        if (user.isDeleted()) {
            throw new BusinessException("User account is deleted");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException("Invalid email or password");
        }

        String token = jwtUtil.generate(
                user.getUsername(),
                user.getRole().name());

        return new LoginResponse(
                new UserDTO(
                        user.getId().toString(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole(),
                        null, // avatar
                        null, // department
                        user.getCreatedAt() != null ? user.getCreatedAt().toString()
                                : java.time.LocalDateTime.now().toString(),
                        user.getUpdatedAt() != null ? user.getUpdatedAt().toString()
                                : java.time.LocalDateTime.now().toString()),
                token,
                "refresh-token-placeholder", // Add logic for refresh token if needed
                3600 // expiration in seconds
        );
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new BusinessException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role() != null ? request.role() : Role.USER);
        user.setActive(true);
        user.setDeleted(false);

        userRepository.save(user);

        String token = jwtUtil.generate(
                user.getUsername(),
                user.getRole().name());

        return new LoginResponse(
                new UserDTO(
                        user.getId().toString(),
                        user.getUsername(), // Using username as email for now if they are same, or need to fix
                                            // RegisterRequest to accept email
                        "User",
                        "User",
                        user.getRole(),
                        null,
                        null,
                        java.time.LocalDateTime.now().toString(),
                        java.time.LocalDateTime.now().toString()),
                token,
                "refresh-token-placeholder",
                3600);
    }

    @org.springframework.transaction.annotation.Transactional
    public void changePassword(String username, ChangePasswordRequest req) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!passwordEncoder.matches(req.oldPassword(), user.getPassword())) {
            throw new BusinessException("Invalid old password");
        }

        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
    }
}
