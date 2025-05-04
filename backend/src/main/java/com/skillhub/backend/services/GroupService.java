package com.skillhub.backend.services;

import com.skillhub.backend.models.Group;
import com.skillhub.backend.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    public Group createGroup(Group group) {
        return groupRepository.save(group);
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

    public Group updateGroup(String id, Group updatedGroup) {
        Optional<Group> optionalGroup = groupRepository.findById(id);
        if (optionalGroup.isPresent()) {
            Group group = optionalGroup.get();
            group.setName(updatedGroup.getName());
            group.setDescription(updatedGroup.getDescription());
            return groupRepository.save(group);
        }
        return null;
    }

    public void deleteGroup(String id) {
        groupRepository.deleteById(id);
    }

    public Group joinGroup(String groupId, String userId) {
        Optional<Group> optionalGroup = groupRepository.findById(groupId);
        if (optionalGroup.isPresent()) {
            Group group = optionalGroup.get();
            group.getMembers().add(userId);
            return groupRepository.save(group);
        }
        return null;
    }

    public Group leaveGroup(String groupId, String userId) {
        Optional<Group> optionalGroup = groupRepository.findById(groupId);
        if (optionalGroup.isPresent()) {
            Group group = optionalGroup.get();
            group.getMembers().remove(userId);
            return groupRepository.save(group);
        }
        return null;
    }
}
