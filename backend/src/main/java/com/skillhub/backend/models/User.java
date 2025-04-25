package com.skillhub.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Document(collection = "users")
public class User implements UserDetails {
    @Id
    private String id;
    private String username;
    private String email;
    private String password; // Stored in plain text as requested
    private String firstName;
    private String lastName;
    private String bio;
    private String profileImage;
    private String phoneNumber;
    private boolean privateProfile;
    private List<String> skills = new ArrayList<>();
    
    // Following system fields
    private List<String> following = new ArrayList<>(); // IDs of users this user follows
    private List<String> followers = new ArrayList<>(); // IDs of users following this user
    private List<String> pendingFollowRequests = new ArrayList<>(); // IDs of pending follow requests
    
    // UserDetails interface implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Return empty list or add roles if you have them
        return List.of(new SimpleGrantedAuthority("USER")); // Basic role for all users
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Account never expires
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Account never locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credentials never expire
    }

    @Override
    public boolean isEnabled() {
        return true; // Account always enabled
    }
    
    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public void addSkill(String skill) {
        if (skills == null) {
            skills = new ArrayList<>();
        }
        skills.add(skill);
    }
    
    public void removeSkill(String skill) {
        if (skills != null) {
            skills.remove(skill);
        }
    }
    
    public void followUser(String userId) {
        if (following == null) {
            following = new ArrayList<>();
        }
        if (!following.contains(userId)) {
            following.add(userId);
        }
    }
    
    public void unfollowUser(String userId) {
        if (following != null) {
            following.remove(userId);
        }
    }
    
    public void addFollower(String userId) {
        if (followers == null) {
            followers = new ArrayList<>();
        }
        if (!followers.contains(userId)) {
            followers.add(userId);
        }
    }
    
    public void removeFollower(String userId) {
        if (followers != null) {
            followers.remove(userId);
        }
    }
    
    public void addPendingRequest(String userId) {
        if (pendingFollowRequests == null) {
            pendingFollowRequests = new ArrayList<>();
        }
        if (!pendingFollowRequests.contains(userId)) {
            pendingFollowRequests.add(userId);
        }
    }
    
    public void removePendingRequest(String userId) {
        if (pendingFollowRequests != null) {
            pendingFollowRequests.remove(userId);
        }
    }
}