package com.skillhub.backend.service;

import com.skillhub.backend.model.SkillEndorsement;
import com.skillhub.backend.repository.SkillEndorsementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillEndorsementService {

    @Autowired
    private SkillEndorsementRepository repository;

    public SkillEndorsement endorseSkill(SkillEndorsement endorsement) {
        return repository.save(endorsement);
    }

    public List<SkillEndorsement> getEndorsementsByUser(String userId) {
        return repository.findByEndorsedUserId(userId);
    }

    public List<SkillEndorsement> getEndorsementsBySkill(String userId, String skill) {
        return repository.findByEndorsedUserIdAndSkillName(userId, skill);
    }

    public void deleteEndorsement(String id) {
        repository.deleteById(id);
    }

    public List<SkillEndorsement> getAllEndorsements() {
        return repository.findAll();
    }
}
