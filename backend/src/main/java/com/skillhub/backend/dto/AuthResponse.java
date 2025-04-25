package com.skillhub.backend.dto;

import com.skillhub.backend.model.User;

public class AuthResponse {
    private User user;
    private String message;

    public AuthResponse(User user, String message) {
        this.user = user;
        this.message = message;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
