package com.company.platform.common;

import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public org.springframework.http.ResponseEntity<java.util.Map<String, String>> handleBusinessException(
            BusinessException e) {
        return org.springframework.http.ResponseEntity
                .status(org.springframework.http.HttpStatus.BAD_REQUEST)
                .body(java.util.Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public org.springframework.http.ResponseEntity<java.util.Map<String, String>> handleException(Exception e) {
        e.printStackTrace();
        return org.springframework.http.ResponseEntity
                .status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of("message",
                        e.getMessage() != null ? e.getMessage() : "An unexpected error occurred"));
    }
}
