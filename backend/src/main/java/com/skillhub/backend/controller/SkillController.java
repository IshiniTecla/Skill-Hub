package com.skillhub.backend.controller;

import com.skillhub.backend.model.Skill;
import com.skillhub.backend.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @PostMapping
    public ResponseEntity<Skill> addSkill(@RequestBody Skill skill) {
        return ResponseEntity.ok(skillService.createSkill(skill));
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable String id) {
        return skillService.getSkillById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable String id, @RequestBody Skill skill) {
        return ResponseEntity.ok(skillService.updateSkill(id, skill));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable String id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/endorse")
    public ResponseEntity<Skill> endorseSkill(@PathVariable String id) {
        Skill endorsedSkill = skillService.endorseSkill(id);
        return ResponseEntity.ok(endorsedSkill);
    }

    @DeleteMapping("/{id}/endorse")
    public ResponseEntity<String> deleteEndorsement(@PathVariable String id) {
        try {
            skillService.removeEndorsement(id);
            return ResponseEntity.ok("Endorsement removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to remove endorsement");
        }
    }

}
