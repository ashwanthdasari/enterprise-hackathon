package com.company.platform.auth;

import com.company.platform.auth.LoginRequest;
import com.company.platform.auth.LoginResponse;
import com.company.platform.auth.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return service.login(req);
    }

    @PostMapping("/register")
    public LoginResponse register(@RequestBody RegisterRequest req) {
        return service.register(req);
    }

    @PostMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordRequest req,
            org.springframework.security.core.Authentication auth) {
        service.changePassword(auth.getName(), req);
    }
}
