package com.skillhub.backend.repository;

import com.skillhub.backend.models.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findByOwnerId(String ownerId);
}
