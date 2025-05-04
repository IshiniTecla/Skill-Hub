package com.skillhub.backend.services;

import com.skillhub.backend.models.GroupMessage;
import com.skillhub.backend.repository.GroupMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupMessageService {

    @Autowired
    private GroupMessageRepository groupMessageRepository;

    public GroupMessage sendMessage(GroupMessage message) {
        return groupMessageRepository.save(message);
    }

    public List<GroupMessage> getMessagesByGroup(String groupId) {
        return groupMessageRepository.findByGroupIdOrderByTimestampAsc(groupId);
    }
}

