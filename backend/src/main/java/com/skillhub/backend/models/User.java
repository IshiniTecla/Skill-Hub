package com.skillhub.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password; 
    private String firstName;
    private String lastName;
    private String bio;
    private String profileImage;
    private String phoneNumber; 
    private boolean privateProfile;
    private List<String> skills = new ArrayList<>();
}
