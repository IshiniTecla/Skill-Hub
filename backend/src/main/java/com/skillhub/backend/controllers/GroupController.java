package com.skillhub.backend.controllers;

import com.skillhub.backend.models.Group;
import com.skillhub.backend.services.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/create")
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        return ResponseEntity.ok(groupService.createGroup(group));
    }

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable String id) {
        return groupService.getGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{groupId}/join/{userId}")
    public ResponseEntity<Group> joinGroup(@PathVariable String groupId, @PathVariable String userId) {
        Group updated = groupService.joinGroup(groupId, userId);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{groupId}/leave/{userId}")
    public ResponseEntity<Group> leaveGroup(@PathVariable String groupId, @PathVariable String userId) {
        Group updated = groupService.leaveGroup(groupId, userId);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable String id, @RequestBody Group updatedGroup) {
        Group updated = groupService.updateGroup(id, updatedGroup);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String id) {
        groupService.deleteGroup(id);
        return ResponseEntity.ok().build();
    }
}
