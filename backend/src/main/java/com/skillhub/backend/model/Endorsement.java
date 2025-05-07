package com.skillhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "endorsements")
public class Endorsement {

    @Id
    private String id;
    private String skillId;
    private String endorserName;
    private String comment;
    private String level; // Beginner, Intermediate, Expert

    public Endorsement() {
    }

    public Endorsement(String skillId, String endorserName, String comment, String level) {
        this.skillId = skillId;
        this.endorserName = endorserName;
        this.comment = comment;
        this.level = level;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public String getSkillId() {
        return skillId;
    }

    public void setSkillId(String skillId) {
        this.skillId = skillId;
    }

    public String getEndorserName() {
        return endorserName;
    }

    public void setEndorserName(String endorserName) {
        this.endorserName = endorserName;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
