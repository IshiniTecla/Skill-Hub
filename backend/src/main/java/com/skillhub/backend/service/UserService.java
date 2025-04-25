package com.skillhub.backend.service;

import com.skillhub.backend.model.User;
import com.skillhub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Make sure PasswordEncoder is used instead of directly using
                                             // BCryptPasswordEncoder

    // Register user
    public User registerUser(User user) {
        // Hash password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encrypt password before saving
        return userRepository.save(user);
    }

    // Authenticate user with email and password
    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }

    // Handle social login (assume the method exists for social login)
    public User handleSocialLogin(String provider, String providerId, String email, String firstName, String lastName) {
        // Logic to handle social login
        // For example, check if a user exists, otherwise create a new user with social
        // provider data
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            return existingUser.get(); // Return existing user if already registered
        }

        // Create a new user using the social media data
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setPassword("social-login-password"); // You can set a placeholder password or a random value
        return userRepository.save(newUser); // Save new user
    }
}
