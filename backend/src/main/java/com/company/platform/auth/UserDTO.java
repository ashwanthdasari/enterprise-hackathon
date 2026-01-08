package com.company.platform.auth;

import com.company.platform.users.Role;

public record UserDTO(
        String id,
        String email,
        String firstName,
        String lastName,
        Role role,
        String avatar,
        String department,
        String createdAt,
        String updatedAt) {
}
