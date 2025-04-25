package com.skillhub.backend.services;

import com.skillhub.backend.exceptions.InvalidCredentialsException;
import com.skillhub.backend.exceptions.UserAlreadyExistsException;
import com.skillhub.backend.exceptions.UserNotFoundException;
import com.skillhub.backend.models.User;
import com.skillhub.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // CREATE
    public User createUser(User user) {
        // Check if user already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("email");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException("username");
        }

        return userRepository.save(user);
    }

    // READ
    public List<User> getAllUsers() {
        return userRepository.findAll();
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

    // UPDATE
    public User updateUser(String id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException());

        // Check if email is being changed and if it's already in use
        if (userDetails.getEmail() != null && !user.getEmail().equals(userDetails.getEmail()) &&
                userRepository.existsByEmail(userDetails.getEmail())) {
            throw new UserAlreadyExistsException("email");
        }

        // Check if username is being changed and if it's already in use
        if (userDetails.getUsername() != null && !user.getUsername().equals(userDetails.getUsername()) &&
                userRepository.existsByUsername(userDetails.getUsername())) {
            throw new UserAlreadyExistsException("username");
        }

        // Update user fields
        if (userDetails.getUsername() != null)
            user.setUsername(userDetails.getUsername());
        if (userDetails.getEmail() != null)
            user.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null)
            user.setPassword(userDetails.getPassword());
        if (userDetails.getFirstName() != null)
            user.setFirstName(userDetails.getFirstName());
        if (userDetails.getLastName() != null)
            user.setLastName(userDetails.getLastName());
        if (userDetails.getBio() != null)
            user.setBio(userDetails.getBio());
        if (userDetails.getProfileImage() != null)
            user.setProfileImage(userDetails.getProfileImage());
        if (userDetails.getPhoneNumber() != null)
            user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setPrivateProfile(userDetails.isPrivateProfile());

        if (userDetails.getSkills() != null)
            user.setSkills(userDetails.getSkills());
        if (userDetails.getFollowing() != null)
            user.setFollowing(userDetails.getFollowing());
        if (userDetails.getFollowers() != null)
            user.setFollowers(userDetails.getFollowers());
        if (userDetails.getPendingFollowRequests() != null)
            user.setPendingFollowRequests(userDetails.getPendingFollowRequests());

        return userRepository.save(user);
    }

    // DELETE
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException();
        }
        userRepository.deleteById(id);
    }

    // Authentication
    public User authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException();
        }
        
        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            throw new InvalidCredentialsException();
        }
        
        return user;
    }

    // Add these methods for your UserService class
    public List<User> findBySkillsContaining(String skill) {
        return userRepository.findBySkillsContaining(skill);
    }

    public List<User> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName) {
        return userRepository.findByFirstNameContainingOrLastNameContaining(firstName, lastName);
    }

    public List<User> findByFirstNameContainingOrLastNameContainingAndSkillsContaining(
            String firstName, String lastName, String skill) {
        return userRepository.findByFirstNameContainingOrLastNameContainingAndSkillsContaining(firstName, lastName,
                skill);
    }
}