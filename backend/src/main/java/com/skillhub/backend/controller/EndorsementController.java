package com.skillhub.backend.controller;

import com.skillhub.backend.model.Endorsement;
import com.skillhub.backend.service.EndorsementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/endorsements")
public class EndorsementController {

    @Autowired
    private EndorsementService endorsementService;

    @PostMapping
    public ResponseEntity<Endorsement> endorseSkill(@RequestBody Endorsement endorsement) {
        return ResponseEntity.ok(endorsementService.endorseSkill(endorsement));
    }

    @GetMapping("/skill/{skillId}")
    public ResponseEntity<List<Endorsement>> getBySkill(@PathVariable String skillId) {
        return ResponseEntity.ok(endorsementService.getEndorsementsForSkill(skillId));
    }

    @GetMapping("/user/{endorsedUserId}")
    public ResponseEntity<List<Endorsement>> getByUser(@PathVariable String endorsedUserId) {
        return ResponseEntity.ok(endorsementService.getEndorsementsForUser(endorsedUserId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEndorsement(@PathVariable String id) {
        endorsementService.deleteEndorsement(id);
        return ResponseEntity.noContent().build();
    }
}
