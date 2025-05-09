package com.skillhub.backend.services;

import com.skillhub.backend.models.Group;
import com.skillhub.backend.models.User;
import com.skillhub.backend.repository.GroupRepository;
import com.skillhub.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Autowired
    public GroupService(GroupRepository groupRepository, UserRepository userRepository, UserService userService) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public Group createGroup(Group group) {
        group.setCreatedAt(LocalDateTime.now());
        group.setUpdatedAt(LocalDateTime.now());
        
        // Make sure the owner is in the members list
        if (!group.getMembers().contains(group.getOwnerId())) {
            group.getMembers().add(group.getOwnerId());
        }
        
        // First save the group to get the ID
        Group savedGroup = groupRepository.save(group);
        
        // Get the owner and update their owned groups and member groups
        Optional<User> ownerOptional = userRepository.findById(group.getOwnerId());
        if (ownerOptional.isPresent()) {
            User owner = ownerOptional.get();
            // Add to owned groups
            owner.getOwnedGroups().add(savedGroup.getId());
            // Add to member groups
            owner.getMemberGroups().add(savedGroup.getId());
            // Save the user
            userRepository.save(owner);
        }
        
        return savedGroup;
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(String id) {
        return groupRepository.findById(id);
    }

    public List<Group> getGroupsByOwner(String ownerId) {
        return groupRepository.findByOwnerId(ownerId);
    }
    
    public List<Group> getGroupsByMember(String userId) {
        return groupRepository.findByMembersContaining(userId);
    }

    public Group updateGroup(String id, Group updatedGroup) {
        return groupRepository.findById(id)
            .map(group -> {
                group.setName(updatedGroup.getName());
                group.setDescription(updatedGroup.getDescription());
                group.setUpdatedAt(LocalDateTime.now());
                return groupRepository.save(group);
            })
            .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    public void deleteGroup(String id) {
        Group group = groupRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Remove group from all members' records
        for (String memberId : group.getMembers()) {
            try {
                userService.removeMemberGroup(memberId, id);
            } catch (Exception e) {
                // Log error but continue
                System.err.println("Error removing group " + id + " from member " + memberId + ": " + e.getMessage());
            }
        }
        
        // Remove group from owner's owned groups records
        try {
            userService.removeOwnedGroup(group.getOwnerId(), id);
        } catch (Exception e) {
            // Log error but continue
            System.err.println("Error removing owned group " + id + " from owner " + group.getOwnerId() + ": " + e.getMessage());
        }
        
        // Finally delete the group
        groupRepository.deleteById(id);
    }

    public Group joinGroup(String groupId, String userId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
                
        if (!group.getMembers().contains(userId)) {
            group.getMembers().add(userId);
            group.setUpdatedAt(LocalDateTime.now());
            Group savedGroup = groupRepository.save(group);
            
            // Update user's memberGroups
            userService.addMemberGroup(userId, groupId);
            
            return savedGroup;
        }
        return group; // User is already a member
    }

    public Group leaveGroup(String groupId, String userId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
                
        if (group.getOwnerId().equals(userId)) {
            throw new RuntimeException("Group owner cannot leave. Transfer ownership or delete the group.");
        }
                
        if (group.getMembers().contains(userId)) {
            group.getMembers().remove(userId);
            group.setUpdatedAt(LocalDateTime.now());
            Group savedGroup = groupRepository.save(group);
            
            // Update user's memberGroups
            userService.removeMemberGroup(userId, groupId);
            
            return savedGroup;
        }
        return group; // User is not a member
    }
    
    public Group transferOwnership(String groupId, String currentOwnerId, String newOwnerId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
                
        // Verify current owner
        if (!group.getOwnerId().equals(currentOwnerId)) {
            throw new RuntimeException("Only the current owner can transfer ownership");
        }
                
        // Verify new owner is a member
        if (!group.getMembers().contains(newOwnerId)) {
            throw new RuntimeException("New owner must be a member of the group");
        }
                
        // Verify new owner exists
        if (userRepository.findById(newOwnerId).isEmpty()) {
            throw new RuntimeException("New owner not found");
        }
                
        group.setOwnerId(newOwnerId);
        group.setUpdatedAt(LocalDateTime.now());
        Group savedGroup = groupRepository.save(group);
        
        // Update user records
        userService.removeOwnedGroup(currentOwnerId, groupId);
        userService.addOwnedGroup(newOwnerId, groupId);
        
        return savedGroup;
    }
    
    public List<User> getGroupMembers(String groupId) {
        return groupRepository.findById(groupId)
            .map(group -> {
                List<User> members = new ArrayList<>();
                for (String memberId : group.getMembers()) {
                    userRepository.findById(memberId).ifPresent(members::add);
                }
                return members;
            })
            .orElseThrow(() -> new RuntimeException("Group not found"));
    }
}