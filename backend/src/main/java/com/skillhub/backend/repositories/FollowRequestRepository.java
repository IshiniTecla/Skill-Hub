package com.skillhub.backend.repositories;

import com.skillhub.backend.models.FollowRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRequestRepository extends MongoRepository<FollowRequest, String> {
    List<FollowRequest> findByFromUserIdAndStatus(String fromUserId, String status);
    List<FollowRequest> findByToUserIdAndStatus(String toUserId, String status);
    Optional<FollowRequest> findByFromUserIdAndToUserId(String fromUserId, String toUserId);
    boolean existsByFromUserIdAndToUserIdAndStatus(String fromUserId, String toUserId, String status);
}