package com.skillhub.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "follow_requests")
public class FollowRequest {
    @Id
    private String id;
    private String fromUserId; // Who sent the request
    private String toUserId; // Who received the request
    private LocalDateTime createdAt;
    private String status; // "PENDING", "ACCEPTED", "REJECTED"
}