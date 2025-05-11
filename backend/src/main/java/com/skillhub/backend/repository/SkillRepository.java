package com.skillhub.backend.repository;

import com.skillhub.backend.model.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SkillRepository extends MongoRepository<Skill, String> {
    boolean existsByName(String name);
}
