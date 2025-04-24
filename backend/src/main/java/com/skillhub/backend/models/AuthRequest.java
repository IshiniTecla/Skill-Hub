package com.skillhub.backend.models;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password; // Plain text
}