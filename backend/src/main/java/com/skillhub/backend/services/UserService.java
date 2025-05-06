package com.skillhub.backend.services;

import com.skillhub.backend.dto.UserDto;
import com.skillhub.backend.models.User;
import com.skillhub.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("Username already in use");
        }

        User user = User.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .bio("")
                .build();

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User uploadProfileImage(String id, byte[] imageBytes) {
        return userRepository.findById(id)
            .map(user -> {
                user.setProfileImage(imageBytes);
                return userRepository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(String id, UserDto userDto) {
        return userRepository.findById(id)
            .map(user -> {
                // Check if the new username is already taken by another user
                if (!user.getUsername().equals(userDto.getUsername()) && 
                    userRepository.findByUsername(userDto.getUsername()).isPresent()) {
                    throw new RuntimeException("Username already in use");
                }
                
                // Check if the new email is already taken by another user
                if (!user.getEmail().equals(userDto.getEmail()) && 
                    userRepository.findByEmail(userDto.getEmail()).isPresent()) {
                    throw new RuntimeException("Email already in use");
                }
                
                user.setUsername(userDto.getUsername());
                user.setFirstName(userDto.getFirstName());
                user.setLastName(userDto.getLastName());
                
                // Only update the email if it's provided
                if (userDto.getEmail() != null && !userDto.getEmail().isEmpty()) {
                    user.setEmail(userDto.getEmail());
                }
                
                // Only update the password if it's provided
                if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(userDto.getPassword()));
                }
                
                // Update bio if it exists in the request
                if (userDto.getBio() != null) {
                    user.setBio(userDto.getBio());
                }
                
                return userRepository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public User followUser(String userId, String targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new RuntimeException("Users cannot follow themselves");
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        User targetUser = userRepository.findById(targetUserId)
            .orElseThrow(() -> new RuntimeException("Target user not found"));

        user.getFollowing().add(targetUserId);
        targetUser.getFollowers().add(userId);

        userRepository.save(targetUser);
        return userRepository.save(user);
    }

    public User unfollowUser(String userId, String targetUserId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        User targetUser = userRepository.findById(targetUserId)
            .orElseThrow(() -> new RuntimeException("Target user not found"));

        user.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(userId);

        userRepository.save(targetUser);
        return userRepository.save(user);
    }
    
    public User removeFollower(String userId, String followerId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        User follower = userRepository.findById(followerId)
            .orElseThrow(() -> new RuntimeException("Follower not found"));
            
        user.getFollowers().remove(followerId);
        follower.getFollowing().remove(userId);
        
        userRepository.save(follower);
        return userRepository.save(user);
    }
    
    public List<User> getUserFollowers(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        List<User> followers = new ArrayList<>();
        for (String followerId : user.getFollowers()) {
            userRepository.findById(followerId).ifPresent(followers::add);
        }
        
        return followers;
    }
    
    public List<User> getUserFollowing(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        List<User> following = new ArrayList<>();
        for (String followingId : user.getFollowing()) {
            userRepository.findById(followingId).ifPresent(following::add);
        }
        
        return following;
    }
}