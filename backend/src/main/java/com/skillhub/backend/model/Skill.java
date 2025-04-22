package com.skillhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "skills")
public class Skill {

    @Id
    private String id;
    private String name;
    private int endorsementCount = 0;

    public Skill() {
    }

    public Skill(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getEndorsementCount() {
        return endorsementCount;
    }

    public void setEndorsementCount(int endorsementCount) {
        this.endorsementCount = endorsementCount;
    }

}
