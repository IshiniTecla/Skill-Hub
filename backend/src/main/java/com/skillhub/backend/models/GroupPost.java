package com.skillhub.backend.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "group_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupPost {
    @Id
    private String id;
    private String groupId;
    private String postedByUserId;
    private String text;
    private String mediaUrl; // image or video URL
    private LocalDateTime createdAt = LocalDateTime.now();
}
