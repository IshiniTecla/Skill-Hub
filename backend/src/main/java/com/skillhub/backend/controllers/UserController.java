package com.skillhub.backend.controllers;

import com.skillhub.backend.dto.LoginRequest;
import com.skillhub.backend.dto.LoginResponse;
import com.skillhub.backend.dto.UserDto;
import com.skillhub.backend.models.User;
import com.skillhub.backend.services.UserService;
import com.skillhub.backend.utils.JwtUtils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    public UserController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            User createdUser = userService.registerUser(userDto);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtUtils.generateToken(user.getEmail());
            LoginResponse response = new LoginResponse(token, user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }


    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .<ResponseEntity<Object>>map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found")));
    }

    // Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<Object> getCurrentUserProfile(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            String email = jwtUtils.getEmailFromToken(jwt);
            return userService.getUserByEmail(email)
                    .<ResponseEntity<Object>>map(user -> ResponseEntity.ok(user))
                    .orElseGet(() -> ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "User not found")));
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid or missing token"));
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody UserDto userDto) {
        try {
            User updatedUser = userService.updateUser(id, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Follow another user
    @PostMapping("/{userId}/follow/{targetUserId}")
    public ResponseEntity<?> followUser(@PathVariable String userId, @PathVariable String targetUserId) {
        try {
            User user = userService.followUser(userId, targetUserId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Unfollow a user
    @PostMapping("/{userId}/unfollow/{targetUserId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String userId, @PathVariable String targetUserId) {
        try {
            User user = userService.unfollowUser(userId, targetUserId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
