package com.skillhub.backend.services;

import com.skillhub.backend.models.User;
import com.skillhub.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // No password encoding, storing password as is
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        // Check if the user exists with the same email and password
        Optional<User> user = userRepository.findByEmail(email);
        return user.filter(u -> u.getPassword().equals(password)).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User updateUser(String id, User user) {
        if (userRepository.existsById(id)) {
            user.setId(id); // Make sure the ID stays the same when updating
            return userRepository.save(user);
        } else {
            return null;
        }
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User followUser(String userId, String targetUserId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<User> targetUser = userRepository.findById(targetUserId);

        if (user.isPresent() && targetUser.isPresent()) {
            user.get().getFollowing().add(targetUser.get());
            userRepository.save(user.get());
            return user.get();
        }
        return null;
    }

    public User unfollowUser(String userId, String targetUserId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<User> targetUser = userRepository.findById(targetUserId);

        if (user.isPresent() && targetUser.isPresent()) {
            user.get().getFollowing().remove(targetUser.get());
            userRepository.save(user.get());
            return user.get();
        }
        return null;
    }
}
