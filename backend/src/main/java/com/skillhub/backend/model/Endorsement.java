package com.skillhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "endorsements")
public class Endorsement {

    @Id
    private String id;

    private String endorserUserId; // the one who endorses
    private String endorsedUserId; // the one being endorsed
    private String skillId;

    private String workedTogether; // Yes / No
    private String skillRating; // e.g., Excellent, Good, etc.

    public Endorsement() {
    }

    public Endorsement(String endorserUserId, String endorsedUserId, String skillId,
            String workedTogether, String skillRating) {
        this.endorserUserId = endorserUserId;
        this.endorsedUserId = endorsedUserId;
        this.skillId = skillId;
        this.workedTogether = workedTogether;
        this.skillRating = skillRating;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEndorserUserId() {
        return endorserUserId;
    }

    public void setEndorserUserId(String endorserUserId) {
        this.endorserUserId = endorserUserId;
    }

    public String getEndorsedUserId() {
        return endorsedUserId;
    }

    public void setEndorsedUserId(String endorsedUserId) {
        this.endorsedUserId = endorsedUserId;
    }

    public String getSkillId() {
        return skillId;
    }

    public void setSkillId(String skillId) {
        this.skillId = skillId;
    }

    public String getWorkedTogether() {
        return workedTogether;
    }

    public void setWorkedTogether(String workedTogether) {
        this.workedTogether = workedTogether;
    }

    public String getSkillRating() {
        return skillRating;
    }

    public void setSkillRating(String skillRating) {
        this.skillRating = skillRating;
    }
}
