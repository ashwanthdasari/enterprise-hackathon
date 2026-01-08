package com.company.platform.auth;

import com.company.platform.users.Role;

public record RegisterRequest(String username, String password, Role role) {
}
