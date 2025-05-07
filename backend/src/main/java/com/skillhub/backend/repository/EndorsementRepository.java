package com.skillhub.backend.repository;

import com.skillhub.backend.model.Endorsement;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EndorsementRepository extends MongoRepository<Endorsement, String> {
    List<Endorsement> findBySkillId(String skillId);
}
