package com.skillhub.backend.repository;

import com.skillhub.backend.models.GroupMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GroupMessageRepository extends MongoRepository<GroupMessage, String> {
    List<GroupMessage> findByGroupIdOrderByTimestampAsc(String groupId);
}
