package com.skillhub.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillhub.backend.models.GroupPost;

public interface GroupPostRepository extends MongoRepository<GroupPost, String> {
    List<GroupPost> findByGroupIdOrderByCreatedAtDesc(String groupId);
    
}
