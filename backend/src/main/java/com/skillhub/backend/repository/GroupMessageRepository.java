package com.skillhub.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillhub.backend.models.GroupMessage;

@Repository
public interface GroupMessageRepository extends MongoRepository<GroupMessage, String> {
    List<GroupMessage> findByGroupId(String groupId); // Retrieve messages by groupId
    List<GroupMessage> findByGroupIdOrderByCreatedAtAsc(String groupId);
}