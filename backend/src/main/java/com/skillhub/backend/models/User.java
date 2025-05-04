package com.skillhub.backend.models;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String profileImage;
    private String phoneNumber;
    private String profilePic;

    @Builder.Default
    private Set<String> followers = new HashSet<>();

    @Builder.Default
    private Set<String> following = new HashSet<>();
}
