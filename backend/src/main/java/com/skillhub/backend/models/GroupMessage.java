package com.skillhub.backend.models;

import lombok.Data;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "groupMessages")
@Data
public class GroupMessage {

    @Id
    private String id;
    private String groupId;  // ID of the group
    private String userId;   // ID of the user sending the message
    private String content;  // Text content of the message
    private String mediaUrl; // Media URL (for image/video)
    private long timestamp;  // Timestamp for the message
    private LocalDateTime createdAt = LocalDateTime.now();
}
