package com.skillhub.backend.exceptions;

public class InvalidCredentialsException extends CustomException {
    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
}
