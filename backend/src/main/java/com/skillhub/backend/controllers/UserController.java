package com.skillhub.backend.controllers;

import com.skillhub.backend.config.JwtService;
import com.skillhub.backend.exceptions.CustomException;
import com.skillhub.backend.exceptions.InvalidCredentialsException;
import com.skillhub.backend.exceptions.UserNotFoundException;
import com.skillhub.backend.models.AuthRequest;
import com.skillhub.backend.models.AuthResponse;
import com.skillhub.backend.models.User;
import com.skillhub.backend.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public UserController(UserService userService, JwtService jwtService, UserDetailsService userDetailsService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        try {
            logger.info("Registering new user with email: {}", user.getEmail());
            User createdUser = userService.createUser(user);

            UserDetails userDetails = userDetailsService.loadUserByUsername(createdUser.getEmail());
            String jwtToken = jwtService.generateToken(userDetails);

            AuthResponse response = AuthResponse.builder()
                    .token(jwtToken)
                    .email(createdUser.getEmail())
                    .userId(createdUser.getId())
                    .message("User registered successfully")
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error registering user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    AuthResponse.builder()
                            .message("Registration failed: " + e.getMessage())
                            .build());
        }
    }

    // User login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        try {
            logger.info("Login attempt for email: {}", authRequest.getEmail());

            // Use the authenticate method that throws proper exceptions
            User user = userService.authenticate(authRequest.getEmail(), authRequest.getPassword());

            // Generate token
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String jwtToken = jwtService.generateToken(userDetails);

            AuthResponse response = AuthResponse.builder()
                    .token(jwtToken)
                    .email(user.getEmail())
                    .userId(user.getId())
                    .message("Login successful")
                    .build();

            return ResponseEntity.ok(response);
        } catch (UserNotFoundException e) {
            logger.warn("Login failed: User not found with email: {}", authRequest.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    AuthResponse.builder()
                            .message("User not found")
                            .build());
        } catch (InvalidCredentialsException e) {
            logger.warn("Login failed: Invalid credentials for email: {}", authRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    AuthResponse.builder()
                            .message("Invalid password")
                            .build());
        } catch (Exception e) {
            logger.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    AuthResponse.builder()
                            .message("An error occurred: " + e.getMessage())
                            .build());
        }
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        logger.info("Fetching all users");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        try {
            logger.info("Fetching user with ID: {}", id);
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new UserNotFoundException());
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            logger.warn("User not found with ID: {}", id);
            throw e; // Will be handled by GlobalExceptionHandler
        }
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        try {
            logger.info("Updating user with ID: {}", id);
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (CustomException e) {
            logger.warn("Error updating user: {}", e.getMessage());
            throw e; // Will be handled by GlobalExceptionHandler
        }
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        try {
            logger.info("Deleting user with ID: {}", id);
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (UserNotFoundException e) {
            logger.warn("User not found for deletion with ID: {}", id);
            throw e; // Will be handled by GlobalExceptionHandler
        }
    }

    // Search users by name or skill
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String skill) {

        logger.info("Searching users with name: {} and skill: {}", name, skill);

        if (name != null && skill != null) {
            return ResponseEntity.ok(
                    userService.findByFirstNameContainingOrLastNameContainingAndSkillsContaining(name, name, skill));
        } else if (name != null) {
            return ResponseEntity.ok(userService.findByFirstNameContainingOrLastNameContaining(name, name));
        } else if (skill != null) {
            return ResponseEntity.ok(userService.findBySkillsContaining(skill));
        } else {
            return ResponseEntity.ok(userService.getAllUsers());
        }
    }

    // Get user profile (public facing info)
    @GetMapping("/profile/{username}")
    public ResponseEntity<User> getUserProfile(@PathVariable String username) {
        try {
            logger.info("Fetching profile for username: {}", username);
            User user = userService.getUserByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException());

            // If you want to remove sensitive info before returning
            user.setPassword(null);

            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            logger.warn("Profile not found for username: {}", username);
            throw e;
        }
    }

    // User follow functionality
    @PostMapping("/{id}/follow/{targetId}")
    public ResponseEntity<String> followUser(
            @PathVariable String id,
            @PathVariable String targetId) {
        try {
            logger.info("User {} attempting to follow user {}", id, targetId);

            // Get both users
            User follower = userService.getUserById(id)
                    .orElseThrow(() -> new UserNotFoundException());

            User target = userService.getUserById(targetId)
                    .orElseThrow(() -> new UserNotFoundException());

            // Handle private profiles
            if (target.isPrivateProfile()) {
                // Add to pending requests
                target.addPendingRequest(id);
                userService.updateUser(targetId, target);
                return ResponseEntity.ok("Follow request sent");
            } else {
                // Direct follow for public profiles
                follower.followUser(targetId);
                target.addFollower(id);

                userService.updateUser(id, follower);
                userService.updateUser(targetId, target);

                return ResponseEntity.ok("Now following user");
            }
        } catch (UserNotFoundException e) {
            logger.warn("Follow operation failed: {}", e.getMessage());
            throw e;
        }
    }

    // User unfollow functionality
    @PostMapping("/{id}/unfollow/{targetId}")
    public ResponseEntity<String> unfollowUser(
            @PathVariable String id,
            @PathVariable String targetId) {
        try {
            logger.info("User {} attempting to unfollow user {}", id, targetId);

            // Get both users
            User follower = userService.getUserById(id)
                    .orElseThrow(() -> new UserNotFoundException());

            User target = userService.getUserById(targetId)
                    .orElseThrow(() -> new UserNotFoundException());

            // Remove from following/followers
            follower.unfollowUser(targetId);
            target.removeFollower(id);

            userService.updateUser(id, follower);
            userService.updateUser(targetId, target);

            return ResponseEntity.ok("Successfully unfollowed user");
        } catch (UserNotFoundException e) {
            logger.warn("Unfollow operation failed: {}", e.getMessage());
            throw e;
        }
    }

    // Accept follow request
    @PostMapping("/{id}/accept-follow/{requesterId}")
    public ResponseEntity<String> acceptFollowRequest(
            @PathVariable String id,
            @PathVariable String requesterId) {
        try {
            logger.info("User {} accepting follow request from {}", id, requesterId);

            // Get both users
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new UserNotFoundException());

            User requester = userService.getUserById(requesterId)
                    .orElseThrow(() -> new UserNotFoundException());

            // Process the request
            if (user.getPendingFollowRequests().contains(requesterId)) {
                user.removePendingRequest(requesterId);
                user.addFollower(requesterId);
                requester.followUser(id);

                userService.updateUser(id, user);
                userService.updateUser(requesterId, requester);

                return ResponseEntity.ok("Follow request accepted");
            } else {
                return ResponseEntity.badRequest().body("No pending request found");
            }
        } catch (UserNotFoundException e) {
            logger.warn("Accept follow request operation failed: {}", e.getMessage());
            throw e;
        }
    }

    // Reject follow request
    @PostMapping("/{id}/reject-follow/{requesterId}")
    public ResponseEntity<String> rejectFollowRequest(
            @PathVariable String id,
            @PathVariable String requesterId) {
        try {
            logger.info("User {} rejecting follow request from {}", id, requesterId);

            User user = userService.getUserById(id)
                    .orElseThrow(() -> new UserNotFoundException());

            // Just remove from pending
            if (user.getPendingFollowRequests().contains(requesterId)) {
                user.removePendingRequest(requesterId);
                userService.updateUser(id, user);
                return ResponseEntity.ok("Follow request rejected");
            } else {
                return ResponseEntity.badRequest().body("No pending request found");
            }
        } catch (UserNotFoundException e) {
            logger.warn("Reject follow request operation failed: {}", e.getMessage());
            throw e;
        }
    }
}