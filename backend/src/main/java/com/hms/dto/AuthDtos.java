package com.hms.dto;

public class AuthDtos {
    public record RegisterRequest(String name, String email, String password, String role) {}
    public record LoginRequest(String email, String password) {}
    public record AuthResponse(String token, String email, String name, String role) {}
}
