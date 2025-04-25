package com.skillhub.backend.dtos.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class UserRequestDTO {
    @NotBlank @Size(min = 3, max = 20)
    private String username;
    
    @NotBlank @Email
    private String email;
    
    @NotBlank @Size(min = 6)
    private String password;
    
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
    
    private String bio;
    private String profileImage;
    private String phoneNumber;
    private boolean privateProfile;
    private List<String> skills;
}