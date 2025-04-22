package com.skillhub.backend.service;

import com.skillhub.backend.model.Skill;
import com.skillhub.backend.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    public Skill createSkill(Skill skill) {
        if (skillRepository.existsByName(skill.getName())) {
            throw new RuntimeException("Skill already exists");
        }
        return skillRepository.save(skill);
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Optional<Skill> getSkillById(String id) {
        return skillRepository.findById(id);
    }

    public Skill updateSkill(String id, Skill updatedSkill) {
        Skill existingSkill = skillRepository.findById(id).orElseThrow(() -> new RuntimeException("Skill not found"));
        existingSkill.setName(updatedSkill.getName());
        return skillRepository.save(existingSkill);
    }

    public void deleteSkill(String id) {
        skillRepository.deleteById(id);
    }

    public Skill endorseSkill(String id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        skill.setEndorsementCount(skill.getEndorsementCount() + 1);
        return skillRepository.save(skill);
    }

}
