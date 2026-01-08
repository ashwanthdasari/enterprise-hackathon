package com.company.platform.auth;

public record ChangePasswordRequest(
        String oldPassword,
        String newPassword) {
}
