package com.skillhub.backend.controllers;

import com.skillhub.backend.dto.GroupDto;
import com.skillhub.backend.models.Group;
import com.skillhub.backend.models.User;
import com.skillhub.backend.services.GroupService;
import com.skillhub.backend.services.UserService;
import com.skillhub.backend.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    
    private final GroupService groupService;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    
    @Autowired
    public GroupController(GroupService groupService, UserService userService, JwtUtils jwtUtils) {
        this.groupService = groupService;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }
    
    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody GroupDto groupDto, @RequestHeader("Authorization") String token) {
        try {
            // Extract user email from token
            String email = getUserEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            // Get user by email
            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
            
            User user = userOptional.get();
            String userId = user.getId();
            
            Group group = Group.builder()
                    .name(groupDto.getName())
                    .description(groupDto.getDescription())
                    .ownerId(userId)
                    .build();
            
            // Add owner as first member
            group.getMembers().add(userId);
            
            // Create the group using the service which handles group creation and user updates
            Group createdGroup = groupService.createGroup(group);
            
            return ResponseEntity.ok(createdGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getGroupById(@PathVariable String id) {
        return groupService.getGroupById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Group not found")));
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Group>> getGroupsByOwner(@PathVariable String ownerId) {
        return ResponseEntity.ok(groupService.getGroupsByOwner(ownerId));
    }
    
    @GetMapping("/member/{userId}")
    public ResponseEntity<List<Group>> getGroupsByMember(@PathVariable String userId) {
        return ResponseEntity.ok(groupService.getGroupsByMember(userId));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(@PathVariable String id, @RequestBody GroupDto groupDto, 
                                       @RequestHeader("Authorization") String token) {
        try {
            // Extract user email from token
            String email = getUserEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            // Get user by email
            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
            
            String userId = userOptional.get().getId();
            
            // Check if the group exists
            Optional<Group> groupOptional = groupService.getGroupById(id);
            if (groupOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Group not found"));
            }
            
            // Check if the user is the owner
            Group group = groupOptional.get();
            if (!group.getOwnerId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only the group owner can update the group"));
            }
            
            group.setName(groupDto.getName());
            group.setDescription(groupDto.getDescription());
            
            Group updatedGroup = groupService.updateGroup(id, group);
            return ResponseEntity.ok(updatedGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable String id, @RequestHeader("Authorization") String token) {
        try {
            // Extract user email from token
            String email = getUserEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            // Get user by email
            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
            
            String userId = userOptional.get().getId();
            
            // Check if the group exists
            Optional<Group> groupOptional = groupService.getGroupById(id);
            if (groupOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Group not found"));
            }
            
            // Check if the user is the owner
            Group group = groupOptional.get();
            if (!group.getOwnerId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only the group owner can delete the group"));
            }
            
            groupService.deleteGroup(id);
            return ResponseEntity.ok().body(Map.of("message", "Group deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{groupId}/join")
    public ResponseEntity<?> joinGroup(@PathVariable String groupId, @RequestHeader("Authorization") String token) {
        try {
            // Extract user email from token
            String email = getUserEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            // Get user by email
            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
            
            String userId = userOptional.get().getId();
            
            Group updatedGroup = groupService.joinGroup(groupId, userId);
            return ResponseEntity.ok(updatedGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{groupId}/leave")
    public ResponseEntity<?> leaveGroup(@PathVariable String groupId, @RequestHeader("Authorization") String token) {
        try {
            // Extract user email from token
            String email = getUserEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            // Get user by email
            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
            
            String userId = userOptional.get().getId();
            
            // Check if the user is the owner
            Optional<Group> groupOptional = groupService.getGroupById(groupId);
            if (groupOptional.isPresent() && groupOptional.get().getOwnerId().equals(userId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Group owner cannot leave. Transfer ownership or delete the group instead."));
            }
            
            Group updatedGroup = groupService.leaveGroup(groupId, userId);
            return ResponseEntity.ok(updatedGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{groupId}/add-member/{memberUserId}")
    public ResponseEntity<?> addMember(@PathVariable String groupId, @PathVariable String memberUserId, 
                                      @RequestHeader("Authorization") String token) {
        try {
            // Extract requester email from token
            String email = getUserEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            // Get requester by email
            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
            
            String requesterId = userOptional.get().getId();
            
            // Check if the group exists
            Optional<Group> groupOptional = groupService.getGroupById(groupId);
            if (groupOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Group not found"));
            }
            
            // Check if the requester is the owner
            Group group = groupOptional.get();
            if (!group.getOwnerId().equals(requesterId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only the group owner can add members"));
            }
            
            // Check if the user to be added exists
            if (userService.getUserById(memberUserId).isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
            
            Group updatedGroup = groupService.joinGroup(groupId, memberUserId);
            return ResponseEntity.ok(updatedGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{groupId}/remove-member/{memberUserId}")
    public ResponseEntity<?> removeMember(@PathVariable String groupId, @PathVariable String memberUserId, 
                                        @RequestHeader("Authorization") String token) {
        try {
            // Extract requester email from token
            String email = getUserEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            // Get requester by email
            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
            
            String requesterId = userOptional.get().getId();
            
            // Check if the group exists
            Optional<Group> groupOptional = groupService.getGroupById(groupId);
            if (groupOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Group not found"));
            }
            
            // Check if the requester is the owner
            Group group = groupOptional.get();
            if (!group.getOwnerId().equals(requesterId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only the group owner can remove members"));
            }
            
            // Cannot remove the owner
            if (memberUserId.equals(group.getOwnerId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Cannot remove the group owner"));
            }
            
            Group updatedGroup = groupService.leaveGroup(groupId, memberUserId);
            return ResponseEntity.ok(updatedGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{groupId}/transfer-ownership/{newOwnerId}")
    public ResponseEntity<?> transferOwnership(@PathVariable String groupId, @PathVariable String newOwnerId, 
                                             @RequestHeader("Authorization") String token) {
        try {
            // Extract current owner email from token
            String email = getUserEmailFromToken(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            // Get current owner by email
            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
            
            String currentOwnerId = userOptional.get().getId();
            
            Group updatedGroup = groupService.transferOwnership(groupId, currentOwnerId, newOwnerId);
            return ResponseEntity.ok(updatedGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{groupId}/members")
    public ResponseEntity<?> getGroupMembers(@PathVariable String groupId) {
        try {
            List<User> members = groupService.getGroupMembers(groupId);
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Helper method to extract user email from JWT token
    private String getUserEmailFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            return jwtUtils.getEmailFromToken(jwt);
        }
        return null;
    }
}