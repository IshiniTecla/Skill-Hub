package com.skillhub.backend.exceptions;

public class UserAlreadyExistsException extends CustomException {
    public UserAlreadyExistsException(String field) {
        super("User with this " + field + " already exists");
    }
}