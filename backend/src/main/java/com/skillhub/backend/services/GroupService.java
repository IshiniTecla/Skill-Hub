package com.skillhub.backend.services;


import com.skillhub.backend.models.Group;
import com.skillhub.backend.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(String id) {
        return groupRepository.findById(id);
    }

    public Group updateGroup(String id, Group updatedGroup) {
        return groupRepository.findById(id)
                .map(group -> {
                    group.setName(updatedGroup.getName());
                    group.setDescription(updatedGroup.getDescription());
                    group.setGroupImage(updatedGroup.getGroupImage());
                    return groupRepository.save(group);
                }).orElseThrow(() -> new RuntimeException("Group not found"));
    }

    public void deleteGroup(String id) {
        groupRepository.deleteById(id);
    }

    public Group joinGroup(String groupId, String userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        group.getMembers().add(userId);
        return groupRepository.save(group);
    }
}