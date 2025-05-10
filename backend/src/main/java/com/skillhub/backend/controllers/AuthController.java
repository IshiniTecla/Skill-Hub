package com.skillhub.backend.controllers;

import com.skillhub.backend.dto.LoginRequest;
import com.skillhub.backend.dto.LoginResponse;
import com.skillhub.backend.dto.UserDto;
import com.skillhub.backend.models.User;
import com.skillhub.backend.services.UserService;
import com.skillhub.backend.utils.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, JwtUtils jwtUtils, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            // Encrypt the password before saving
            userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
            User createdUser = userService.registerUser(userDto);
            
            // Generate token for the new user
            String token = jwtUtils.generateToken(createdUser.getEmail());
            return ResponseEntity.ok(new LoginResponse(token, createdUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtUtils.generateToken(user.getEmail());
            return ResponseEntity.ok(new LoginResponse(token, user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }
}