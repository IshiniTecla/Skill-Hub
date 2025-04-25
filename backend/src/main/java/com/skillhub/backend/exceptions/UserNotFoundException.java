package com.skillhub.backend.exceptions;

public class UserNotFoundException extends CustomException {
    public UserNotFoundException() {
        super("User not found");
    }
}
