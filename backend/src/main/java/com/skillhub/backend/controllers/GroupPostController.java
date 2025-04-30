package com.skillhub.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skillhub.backend.models.Group;
import com.skillhub.backend.models.GroupPost;
import com.skillhub.backend.repository.GroupPostRepository;
import com.skillhub.backend.repository.GroupRepository;

import java.util.*;

@RestController
@RequestMapping("/api/group-posts")
@CrossOrigin(origins = "*")
public class GroupPostController {

    @Autowired
    private GroupPostRepository groupPostRepository;

    @Autowired
    private GroupRepository groupRepository;

    // Create a post in a group
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody GroupPost post) {
        Optional<Group> group = groupRepository.findById(post.getGroupId());
        if (group.isEmpty()) return ResponseEntity.badRequest().body("Group not found");

        if (!group.get().getMembers().contains(post.getPostedByUserId())) {
            return ResponseEntity.status(403).body("You are not a member of this group");
        }

        return ResponseEntity.ok(groupPostRepository.save(post));
    }

    // Get all posts in a group
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<GroupPost>> getPosts(@PathVariable String groupId) {
        return ResponseEntity.ok(groupPostRepository.findByGroupIdOrderByCreatedAtDesc(groupId));
    }

    // Delete a post
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        groupPostRepository.deleteById(postId);
        return ResponseEntity.ok().build();
    }
}
