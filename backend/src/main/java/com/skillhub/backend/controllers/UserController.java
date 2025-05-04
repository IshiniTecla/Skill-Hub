package com.skillhub.backend.controllers;

import com.skillhub.backend.models.User;
import com.skillhub.backend.services.UserService;
import com.skillhub.backend.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allow frontend to access APIs
public class UserController {

    @Autowired
    private UserService userService;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User createdUser = userService.registerUser(user);
        return ResponseEntity.ok(createdUser);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginRequest) {
        User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null) {
            String token = JwtUtils.generateToken(user.getEmail());  // Generate JWT token
            return ResponseEntity.ok(token);  // Return token
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    // Get all users (Requires Authentication)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Follow another user
    @PostMapping("/{userId}/follow/{targetUserId}")
    public ResponseEntity<User> followUser(@PathVariable String userId, @PathVariable String targetUserId) {
        User user = userService.followUser(userId, targetUserId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // Unfollow a user
    @PostMapping("/{userId}/unfollow/{targetUserId}")
    public ResponseEntity<User> unfollowUser(@PathVariable String userId, @PathVariable String targetUserId) {
        User user = userService.unfollowUser(userId, targetUserId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
