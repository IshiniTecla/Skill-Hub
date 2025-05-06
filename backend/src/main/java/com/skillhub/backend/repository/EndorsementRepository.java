package com.skillhub.backend.repository;

import com.skillhub.backend.model.Endorsement;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EndorsementRepository extends MongoRepository<Endorsement, String> {
    List<Endorsement> findByEndorsedUserId(String endorsedUserId);

    List<Endorsement> findBySkillId(String skillId);

    Optional<Endorsement> findByEndorserUserIdAndSkillId(String endorserUserId, String skillId);
}
