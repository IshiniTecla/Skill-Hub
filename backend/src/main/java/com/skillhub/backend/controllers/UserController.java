package com.skillhub.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skillhub.backend.models.User;
import com.skillhub.backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allow frontend to access this endpoint
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // CREATE
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    // READ - Get All
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // READ - Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(existing -> {
            existing.setUsername(updatedUser.getUsername());
            existing.setEmail(updatedUser.getEmail());
            existing.setFirstName(updatedUser.getFirstName());
            existing.setLastName(updatedUser.getLastName());
            existing.setBio(updatedUser.getBio());
            existing.setProfileImage(updatedUser.getProfileImage());
            existing.setPhoneNumber(updatedUser.getPhoneNumber());
            existing.setPrivateProfile(updatedUser.isPrivateProfile());
            return ResponseEntity.ok(userRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Follow a user
    @PutMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<?> followUser(@PathVariable String userId, @PathVariable String targetId) {
        if (userId.equals(targetId)) {
            return ResponseEntity.badRequest().body("You cannot follow yourself.");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> targetOpt = userRepository.findById(targetId);

        if (userOpt.isPresent() && targetOpt.isPresent()) {
            User user = userOpt.get();
            User target = targetOpt.get();

            user.getFollowing().add(targetId);
            target.getFollowers().add(userId);

            userRepository.save(user);
            userRepository.save(target);

            return ResponseEntity.ok("User followed successfully.");
        }
        return ResponseEntity.notFound().build();
    }

    // Unfollow a user
    @PutMapping("/{userId}/unfollow/{targetId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String userId, @PathVariable String targetId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> targetOpt = userRepository.findById(targetId);

        if (userOpt.isPresent() && targetOpt.isPresent()) {
            User user = userOpt.get();
            User target = targetOpt.get();

            user.getFollowing().remove(targetId);
            target.getFollowers().remove(userId);

            userRepository.save(user);
            userRepository.save(target);

            return ResponseEntity.ok("User unfollowed successfully.");
        }
        return ResponseEntity.notFound().build();
    }

}