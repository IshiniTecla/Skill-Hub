package com.skillhub.controller;

import com.skillhub.model.User;
import com.skillhub.service.UserService;
import com.skillhub.dto.LoginRequest;
import com.skillhub.dto.RegisterRequest;
import com.skillhub.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return userService.authenticateUser(request.getEmail(), request.getPassword())
                .map(user -> ResponseEntity.ok(new AuthResponse(user, "Login successful.")))
                .orElseGet(() -> ResponseEntity.badRequest().body("Invalid credentials"));
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
