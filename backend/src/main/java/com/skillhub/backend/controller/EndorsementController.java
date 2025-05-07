package com.skillhub.backend.controller;

import com.skillhub.backend.model.Endorsement;
import com.skillhub.backend.service.EndorsementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/endorsements")
@CrossOrigin(origins = "*")
public class EndorsementController {

    @Autowired
    private EndorsementRepository endorsementRepository;

    // Submit a new endorsement
    @PostMapping
    public ResponseEntity<Endorsement> createEndorsement(@RequestBody Endorsement endorsement) {
        return ResponseEntity.ok(endorsementRepository.save(endorsement));
    }

    // Get all endorsements for a skill
    @GetMapping("/skill/{skillId}")
    public ResponseEntity<List<Endorsement>> getEndorsementsBySkillId(@PathVariable String skillId) {
        List<Endorsement> list = endorsementRepository.findBySkillId(skillId);
        return ResponseEntity.ok(list);
    }
}