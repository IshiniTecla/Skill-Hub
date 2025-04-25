package com.skillhub.backend.services;

import com.skillhub.backend.dtos.request.UserRequestDTO;
import com.skillhub.backend.dtos.response.UserResponseDTO;
import com.skillhub.backend.models.AuthRequest;
import com.skillhub.backend.models.AuthResponse;
import com.skillhub.backend.models.User;
import com.skillhub.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public AuthResponse authenticate(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        return new AuthResponse("dummy-token", user.getId());
    }

    public void delete(String id) {
        userRepository.deleteById(id);
    }

    public UserResponseDTO update(String id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update user fields
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // Plain text as requested
        // Update other fields as needed
        
        user = userRepository.save(user);
        return new UserResponseDTO(user);
    }

    public List<UserResponseDTO> searchUsers(String name, String skill) {
        if (name != null && skill != null) {
            return userRepository.findByFirstNameContainingOrLastNameContainingAndSkillsContaining(name, name, skill)
                    .stream()
                    .map(UserResponseDTO::new)
                    .collect(Collectors.toList());
        } else if (name != null) {
            return userRepository.findByFirstNameContainingOrLastNameContaining(name, name)
                    .stream()
                    .map(UserResponseDTO::new)
                    .collect(Collectors.toList());
        } else if (skill != null) {
            return userRepository.findBySkillsContaining(skill)
                    .stream()
                    .map(UserResponseDTO::new)
                    .collect(Collectors.toList());
        } else {
            return findAll();
        }
    }

    public UserResponseDTO findById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponseDTO(user);
    }

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll()
                .stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }

    public UserResponseDTO register(UserRequestDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // Storing plain text as requested
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        // Set other fields as needed
        
        user = userRepository.save(user);
        return new UserResponseDTO(user);
    }
}