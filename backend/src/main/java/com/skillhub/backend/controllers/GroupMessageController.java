package com.skillhub.backend.controllers;

import com.skillhub.backend.models.GroupMessage;
import com.skillhub.backend.services.GroupMessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group-messages")
@CrossOrigin
public class GroupMessageController {

    @Autowired
    private GroupMessageService groupMessageService;

    @PostMapping("/send")
    public GroupMessage sendMessage(@RequestBody GroupMessage message) {
        return groupMessageService.sendMessage(message);
    }

    @GetMapping("/group/{groupId}")
    public List<GroupMessage> getMessagesByGroup(@PathVariable String groupId) {
        return groupMessageService.getMessagesByGroup(groupId);
    }
}
