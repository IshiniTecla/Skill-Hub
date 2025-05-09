package com.skillhub.backend.controller;

import com.skillhub.backend.model.LearningPlan;
import com.skillhub.backend.service.LearningPlanService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Optional; 

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class LearningPlanControl {

    @Autowired
    private LearningPlanService service;

    // GET - Retrieve all Learning Plans
    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllPlans() {
        List<LearningPlan> plans = service.getAllPlans();
        return ResponseEntity.ok(plans);
    }



    

    //Get one learning plan
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable("id") String id) {
        Optional<LearningPlan> plan = service.getPlanById(id);
        if (plan.isPresent()) {
            return ResponseEntity.ok(plan.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Return 404 if plan not found
    }
    




    //update learning plan
    @PutMapping("/{id}")
public ResponseEntity<LearningPlan> updatePlan(@PathVariable("id") String id, @RequestBody LearningPlan updatedPlan) {
    Optional<LearningPlan> plan = service.getPlanById(id);

    if (plan.isPresent()) {
        LearningPlan existingPlan = plan.get();
        existingPlan.setTitle(updatedPlan.getTitle());
        existingPlan.setDescription(updatedPlan.getDescription());
        existingPlan.setAuthor(updatedPlan.getAuthor());
        existingPlan.setAuthorNote(updatedPlan.getAuthorNote());
        existingPlan.setCourseCategory(updatedPlan.getCourseCategory());
        existingPlan.setCourseType(updatedPlan.getCourseType());
        existingPlan.setCourseFee(updatedPlan.getCourseFee());

        // // Save updated plan in the database
        // LearningPlan savedPlan = service.updatePlan(existingPlan);
        // return ResponseEntity.ok(savedPlan);
    }

    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Return 404 if plan not found
}

    



    // POST - Create a new Learning Plan
    @PostMapping
    public ResponseEntity<?> createPlan(@RequestBody LearningPlan learningPlan) {
        // 1. Validate required fields
        if (learningPlan.getTitle() == null || learningPlan.getTitle().isEmpty()) {
            return ResponseEntity.badRequest().body("Title is required.");
        }
        if (learningPlan.getDescription() == null || learningPlan.getDescription().isEmpty()) {
            return ResponseEntity.badRequest().body("Description is required.");
        }
        if (learningPlan.getAuthor() == null || learningPlan.getAuthor().isEmpty()) {
            return ResponseEntity.badRequest().body("Author is required.");
        }

        // 2. Validate if the author is a number
        if (learningPlan.getAuthor().matches("\\d+")) {
            return ResponseEntity.badRequest().body("Author name cannot be a number.");
        }

        // 3. Validate course fee for 'paid' courses
        if ("paid".equals(learningPlan.getCourseType())) {
            if (learningPlan.getCourseFee() == null || learningPlan.getCourseFee() <= 0) {
                return ResponseEntity.badRequest().body("Course fee is required and should be greater than 0 for paid courses.");
            }
        }

        try {
            // Save the Learning Plan and return the saved object
            LearningPlan savedPlan = service.createPlan(learningPlan);
            return ResponseEntity.ok(savedPlan); // Return saved plan
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing the request: " + e.getMessage());
        }
    }
}
