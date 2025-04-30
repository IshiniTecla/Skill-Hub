package com.skillhub.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skillhub.backend.models.GroupMessage;
import com.skillhub.backend.repository.GroupMessageRepository;

import java.util.List;

@RestController
@RequestMapping("/api/groupMessages")
public class GroupMessageController {

    @Autowired
    private GroupMessageRepository messageRepository;

    @PostMapping
    public ResponseEntity<GroupMessage> sendMessage(@RequestBody GroupMessage message) {
        GroupMessage savedMessage = messageRepository.save(message);
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<List<GroupMessage>> getMessages(@PathVariable String groupId) {
        List<GroupMessage> messages = messageRepository.findByGroupIdOrderByCreatedAtAsc(groupId);
        return ResponseEntity.ok(messages);
    }
}

