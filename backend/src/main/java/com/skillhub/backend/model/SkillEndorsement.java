package com.skillhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "endorsements")
public class SkillEndorsement {
    @Id
    private String id;
    private String endorsedUserId;
    private String endorserUserId;
    private String skillName;
    private LocalDateTime endorsedAt = LocalDateTime.now();

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEndorsedUserId() {
        return endorsedUserId;
    }

    public void setEndorsedUserId(String endorsedUserId) {
        this.endorsedUserId = endorsedUserId;
    }

    public String getEndorserUserId() {
        return endorserUserId;
    }

    public void setEndorserUserId(String endorserUserId) {
        this.endorserUserId = endorserUserId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public LocalDateTime getEndorsedAt() {
        return endorsedAt;
    }

    public void setEndorsedAt(LocalDateTime endorsedAt) {
        this.endorsedAt = endorsedAt;
    }
}
