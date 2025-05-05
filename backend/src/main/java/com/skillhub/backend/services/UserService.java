package com.skillhub.backend.services;

import com.skillhub.backend.dto.UserDto;
import com.skillhub.backend.models.User;
import com.skillhub.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(UserDto userDto) {
        if (!userRepository.findByEmail(userDto.getEmail()).isEmpty()) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(userDto.getPassword()) // plain text
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .build();

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        List<User> users = userRepository.findByEmail(email);
        if (users.isEmpty()) throw new RuntimeException("User not found");

        User user = users.get(0);
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email).stream().findFirst();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User uploadProfileImage(String id, byte[] imageBytes) {
        return userRepository.findById(id).map(user -> {
            user.setProfileImage(imageBytes);
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(String id, UserDto userDto) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            user.setPassword(userDto.getPassword());
            user.setFirstName(userDto.getFirstName());
            user.setLastName(userDto.getLastName());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public User followUser(String userId, String targetUserId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User targetUser = userRepository.findById(targetUserId).orElseThrow(() -> new RuntimeException("Target user not found"));

        user.getFollowing().add(targetUserId);
        targetUser.getFollowers().add(userId);

        userRepository.save(targetUser);
        return userRepository.save(user);
    }

    public User unfollowUser(String userId, String targetUserId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User targetUser = userRepository.findById(targetUserId).orElseThrow(() -> new RuntimeException("Target user not found"));

        user.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(userId);

        userRepository.save(targetUser);
        return userRepository.save(user);
    }
}
