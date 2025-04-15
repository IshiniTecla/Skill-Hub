package com.skillhub.backend.repository;

import com.skillhub.backend.model.SkillEndorsement;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SkillEndorsementRepository extends MongoRepository<SkillEndorsement, String> {
    List<SkillEndorsement> findByEndorsedUserId(String endorsedUserId);

    List<SkillEndorsement> findByEndorserUserId(String endorserUserId);

    List<SkillEndorsement> findByEndorsedUserIdAndSkillName(String endorsedUserId, String skillName);
}
