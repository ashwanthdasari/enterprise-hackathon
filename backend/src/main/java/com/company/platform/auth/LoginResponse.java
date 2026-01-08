package com.company.platform.auth;

public record LoginResponse(
        UserDTO user,
        String token,
        String refreshToken,
        long expiresIn) {
}
