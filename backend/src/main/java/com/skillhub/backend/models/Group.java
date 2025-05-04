package com.skillhub.backend.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "groups")
public class Group {
    @Id
    private String id;

    private String name;
    private String description;
    private String ownerId;

    @Builder.Default
    private Set<String> members = new HashSet<>();
}
