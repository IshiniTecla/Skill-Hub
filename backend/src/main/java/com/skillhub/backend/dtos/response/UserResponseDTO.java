package com.skillhub.backend.dtos.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

import com.skillhub.backend.models.User;



@Getter
@NoArgsConstructor
public class UserResponseDTO {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    private String profileImage;
    private boolean privateProfile;
    private List<String> skills;
    private List<String> following;
    private List<String> followers;
    private int followerCount;
    private int followingCount;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullName = user.getFirstName();
        this.bio = user.getBio();
        this.profileImage = user.getProfileImage();
        this.privateProfile = user.isPrivateProfile();
        this.skills = user.getSkills();
        this.following = user.getFollowing();
        this.followers = user.getFollowers();
        this.followerCount = user.getFollowers() != null ? user.getFollowers().size() : 0;
        this.followingCount = user.getFollowing() != null ? user.getFollowing().size() : 0;
    }
}
