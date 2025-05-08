package com.skillhub.backend.controller;

import com.skillhub.backend.model.LearningPlan;
import com.skillhub.backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/plans")
public class LearningPlanControl {

    @Autowired
    private LearningPlanService service;

    @PostMapping
    public ResponseEntity<?> createPlan(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String author,
            @RequestParam(required = false) String authorNote,
            @RequestParam String courseCategory,
            @RequestParam String courseType,
            @RequestParam(required = false) Double courseFee) {

        // Validate required fields
        if (title == null || title.isEmpty()) {
            return ResponseEntity.badRequest().body("Title is required.");
        }
        if (description == null || description.isEmpty()) {
            return ResponseEntity.badRequest().body("Description is required.");
        }
        if (author == null || author.isEmpty()) {
            return ResponseEntity.badRequest().body("Author is required.");
        }

        // Validate course fee for 'paid' courses
        if ("paid".equals(courseType) && (courseFee == null || courseFee <= 0)) {
            return ResponseEntity.badRequest().body("Course fee is required and should be greater than 0 for paid courses.");
        }

        try {
            // Create and populate the LearningPlan object
            LearningPlan newPlan = new LearningPlan();
            newPlan.setTitle(title);
            newPlan.setDescription(description);
            newPlan.setAuthor(author);
            newPlan.setAuthorNote(authorNote);
            newPlan.setCourseCategory(courseCategory);
            newPlan.setCourseType(courseType);
            newPlan.setCourseFee("paid".equals(courseType) ? courseFee : null);

            // Save the Learning Plan and return the saved object
            LearningPlan savedPlan = service.createPlan(newPlan);
            return ResponseEntity.ok(savedPlan); // Return saved plan

        } catch (IllegalArgumentException e) {
            // Return client-side error if input is invalid
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // General error handling
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing the request: " + e.getMessage());
        }
    }
}
