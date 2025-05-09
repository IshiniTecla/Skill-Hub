package com.skillhub.backend.repository;

import com.skillhub.backend.models.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findByOwnerId(String ownerId);
    
    @Query("{ 'members': { $in: [?0] } }")
    List<Group> findByMembersContaining(String userId);
}
