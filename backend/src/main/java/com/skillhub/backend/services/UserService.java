package com.skillhub.backend.services;

import com.skillhub.backend.dto.UserDto;
import com.skillhub.backend.models.User;
import com.skillhub.backend.repository.UserRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection without @Autowired (Spring injects it automatically)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).size() > 0) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .bio(userDto.getBio())
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .build();

        try {
            return userRepository.save(user);
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Email already in use");
        }
    }

    public User loginUser(String email, String password) {
        List<User> users = userRepository.findByEmail(email);
        if (users.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = users.get(0);
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        List<User> users = userRepository.findByEmail(email);
        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    public User updateUser(String id, UserDto userDto) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (userDto.getUsername() != null) {
                        existingUser.setUsername(userDto.getUsername());
                    }
                    if (userDto.getBio() != null) {
                        existingUser.setBio(userDto.getBio());
                    }
                    if (userDto.getPassword() != null) {
                        existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
                    }
                    return userRepository.save(existingUser);
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

        if (user.getFollowing().contains(targetUserId)) {
            throw new RuntimeException("Already following this user");
        }

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

        if (!user.getFollowing().contains(targetUserId)) {
            throw new RuntimeException("Not following this user");
        }

        user.getFollowing().remove(targetUserId);
        targetUser.getFollowers().remove(userId);

        userRepository.save(targetUser);
        return userRepository.save(user);
    }
}
