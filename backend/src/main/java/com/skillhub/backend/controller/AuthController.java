package com.skillhub.backend.controller;

import com.skillhub.backend.dto.AuthResponse;
import com.skillhub.backend.dto.LoginRequest;
import com.skillhub.backend.dto.RegisterRequest;
import com.skillhub.backend.model.User;
import com.skillhub.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setPassword(request.getPassword());

            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(new AuthResponse(savedUser, "User registered successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userService.authenticateUser(request.getEmail(), request.getPassword());
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(new AuthResponse(userOpt.get(), "Login successful."));
        } else {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    @PostMapping("/oauth")
    public ResponseEntity<?> socialLogin(@RequestBody User userPayload) {
        User user = userService.handleSocialLogin(
                userPayload.getProvider(),
                userPayload.getProviderId(),
                userPayload.getEmail(),
                userPayload.getFirstName(),
                userPayload.getLastName());
        return ResponseEntity.ok(new AuthResponse(user, "Social login successful"));
    }
}