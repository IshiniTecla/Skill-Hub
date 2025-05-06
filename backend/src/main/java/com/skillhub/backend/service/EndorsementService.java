package com.skillhub.backend.service;

import com.skillhub.backend.model.Endorsement;
import com.skillhub.backend.repository.EndorsementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EndorsementService {

    @Autowired
    private EndorsementRepository endorsementRepository;

    public Endorsement endorseSkill(Endorsement endorsement) {
        // Prevent duplicate endorsements
        Optional<Endorsement> existing = endorsementRepository
                .findByEndorserUserIdAndSkillId(endorsement.getEndorserUserId(), endorsement.getSkillId());

        if (existing.isPresent()) {
            throw new RuntimeException("You have already endorsed this skill.");
        }

        return endorsementRepository.save(endorsement);
    }

    public List<Endorsement> getEndorsementsForSkill(String skillId) {
        return endorsementRepository.findBySkillId(skillId);
    }

    public List<Endorsement> getEndorsementsForUser(String endorsedUserId) {
        return endorsementRepository.findByEndorsedUserId(endorsedUserId);
    }

    public void deleteEndorsement(String endorsementId) {
        endorsementRepository.deleteById(endorsementId);
    }
}
