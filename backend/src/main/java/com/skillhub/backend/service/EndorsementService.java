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

    /**
     * Create a new endorsement if not already exists for the same skill by the same
     * user.
     */
    public Endorsement endorseSkill(Endorsement endorsement) {
        if (endorsement == null || endorsement.getEndorserUserId() == null || endorsement.getSkillId() == null) {
            throw new IllegalArgumentException("EndorserUserId and SkillId must not be null.");
        }

        Optional<Endorsement> existing = endorsementRepository
                .findByEndorserUserIdAndSkillId(endorsement.getEndorserUserId(), endorsement.getSkillId());

        if (existing.isPresent()) {
            throw new RuntimeException("You have already endorsed this skill.");
        }

        return endorsementRepository.save(endorsement);
    }

    /**
     * Update certain fields of an existing endorsement.
     */
    public Endorsement updateEndorsement(Endorsement endorsement) {
        if (endorsement == null || endorsement.getId() == null) {
            throw new IllegalArgumentException("Endorsement or ID must not be null.");
        }

        Optional<Endorsement> existing = endorsementRepository.findById(endorsement.getId());

        if (existing.isPresent()) {
            Endorsement updated = existing.get();
            updated.setWorkedTogether(endorsement.getWorkedTogether());
            updated.setSkillRating(endorsement.getSkillRating());
            return endorsementRepository.save(updated);
        } else {
            throw new RuntimeException("Endorsement not found with ID: " + endorsement.getId());
        }
    }

    /**
     * Get all endorsements for a specific skill.
     */
    public List<Endorsement> getEndorsementsForSkill(String skillId) {
        if (skillId == null) {
            throw new IllegalArgumentException("Skill ID must not be null.");
        }

        List<Endorsement> endorsements = endorsementRepository.findBySkillId(skillId);
        System.out.println("Fetched " + endorsements.size() + " endorsements for skillId: " + skillId);
        return endorsements;
    }

    /**
     * Get all endorsements received by a specific user.
     */
    public List<Endorsement> getEndorsementsForUser(String endorsedUserId) {
        if (endorsedUserId == null) {
            throw new IllegalArgumentException("Endorsed User ID must not be null.");
        }

        return endorsementRepository.findByEndorsedUserId(endorsedUserId);
    }

    /**
     * Delete an endorsement by ID.
     */
    public void deleteEndorsement(String endorsementId) {
        if (!endorsementRepository.existsById(endorsementId)) {
            throw new RuntimeException("Endorsement not found with ID: " + endorsementId);
        }
        endorsementRepository.deleteById(endorsementId);
    }
}
