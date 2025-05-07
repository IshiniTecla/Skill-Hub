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
    private EndorsementService endorsementService;

    // Submit a new endorsement
    @PostMapping
    public ResponseEntity<Endorsement> createEndorsement(@RequestBody Endorsement endorsement) {
        return ResponseEntity.ok(endorsementRepository.save(endorsement));
    }

    // Get all endorsements by skill ID
    @GetMapping("/skill/{endorseId}")
    public ResponseEntity<List<Endorsement>> getEndorsementsByEndorseId(@PathVariable String endorseId) {
        List<Endorsement> list = endorsementRepository.findByEndorseId(endorseId); // Fetch by endorse ID
        return ResponseEntity.ok(list);
    }
}