package com.skillhub.backend.service;

import com.skillhub.backend.model.Endorsement;
import com.skillhub.backend.repository.EndorsementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EndorsementService {

    @Autowired
    private EndorsementRepository endorsementRepository;

    public Endorsement createEndorsement(Endorsement endorsement) {
        return endorsementRepository.save(endorsement);
    }

    public List<Endorsement> getEndorsementsBySkillId(String skillId) {
        return endorsementRepository.findBySkillId(skillId);
    }
}
