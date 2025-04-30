package com.skillhub.backend.services;


import com.skillhub.backend.models.User;
import com.skillhub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername()) || userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Username or email already exists");
        }
        return userRepository.save(user);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateProfile(String id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setBio(updatedUser.getBio());
        user.setProfileImage(updatedUser.getProfileImage());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setPrivateProfile(updatedUser.isPrivateProfile());

        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User followUser(String followerId, String followeeId) {
        User follower = userRepository.findById(followerId).orElseThrow(() -> new RuntimeException("Follower not found"));
        User followee = userRepository.findById(followeeId).orElseThrow(() -> new RuntimeException("User to follow not found"));

        if (!follower.getFollowing().contains(followeeId)) {
            follower.getFollowing().add(followeeId);
            followee.getFollowers().add(followerId);
            userRepository.save(followee);
        }

        return userRepository.save(follower);
    }

    public User unfollowUser(String followerId, String followeeId) {
        User follower = userRepository.findById(followerId).orElseThrow(() -> new RuntimeException("Follower not found"));
        User followee = userRepository.findById(followeeId).orElseThrow(() -> new RuntimeException("User to unfollow not found"));

        follower.getFollowing().remove(followeeId);
        followee.getFollowers().remove(followerId);

        userRepository.save(followee);
        return userRepository.save(follower);
    }
}
