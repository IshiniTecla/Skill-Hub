package com.skillhub.backend.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    private byte[] profileImage;

    @Builder.Default
    private Set<String> followers = new HashSet<>();
    
    @Builder.Default
    private Set<String> following = new HashSet<>();
    
    // Groups that this user owns
    @Builder.Default
    private Set<String> ownedGroups = new HashSet<>();
    
    // Groups that this user is a member of
    @Builder.Default
    private Set<String> memberGroups = new HashSet<>();
}