package com.skillhub.backend.controller;

import com.skillhub.backend.model.SkillEndorsement;
import com.skillhub.backend.service.SkillEndorsementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/endorsements")
public class SkillEndorsementController {

    @Autowired
    private SkillEndorsementService service;

    @PostMapping
    public ResponseEntity<SkillEndorsement> endorseSkill(@RequestBody SkillEndorsement endorsement) {
        return ResponseEntity.ok(service.endorseSkill(endorsement));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkillEndorsement>> getByUser(@PathVariable String userId) {
        return ResponseEntity.ok(service.getEndorsementsByUser(userId));
    }

    @GetMapping("/user/{userId}/skill/{skill}")
    public ResponseEntity<List<SkillEndorsement>> getByUserSkill(@PathVariable String userId,
            @PathVariable String skill) {
        return ResponseEntity.ok(service.getEndorsementsBySkill(userId, skill));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEndorsement(@PathVariable String id) {
        service.deleteEndorsement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SkillEndorsement>> getAll() {
        return ResponseEntity.ok(service.getAllEndorsements());
    }
}
