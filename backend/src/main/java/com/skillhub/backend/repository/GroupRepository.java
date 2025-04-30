package com.skillhub.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillhub.backend.models.Group;

public interface GroupRepository extends MongoRepository<Group ,String> {
    
}
