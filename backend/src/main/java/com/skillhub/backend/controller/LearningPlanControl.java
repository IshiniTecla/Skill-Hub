package com.skillhub.backend.controller;

import com.skillhub.backend.model.LearningPlan;
import com.skillhub.backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class LearningPlanControl {

    @Autowired
    private LearningPlanService service;

    // GET - Retrieve all Learning Plans
    @GetMapping
    public List<LearningPlan> getAllPlans() {
        return service.getAllPlans();
    }

    // GET - Retrieve a single Learning Plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable String id) {
        LearningPlan plan = service.getPlanById(id).orElse(null); 
        if (plan == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Return 404 if plan not found
        }
        return ResponseEntity.ok(plan); // Return plan if found
    }

    // POST - Create a new Learning Plan
    @PostMapping
    public ResponseEntity<LearningPlan> createPlan(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String author,
            @RequestParam(required = false) String authorNote,
            @RequestParam String courseCategory,
            @RequestParam String courseType,
            @RequestParam(required = false) Double courseFee,
            @RequestParam("thumbnail") MultipartFile thumbnailFile) throws IOException {

        // Validate course fee if the course type is 'paid'
        if ("paid".equals(courseType) && courseFee == null) {
            return ResponseEntity.badRequest().body(null); // Return bad request if course fee is missing for paid courses
        }

        // Save the file to the server or cloud storage
        String thumbnailPath = saveFile(thumbnailFile);

        // Create a LearningPlan object
        LearningPlan newPlan = new LearningPlan();
        newPlan.setTitle(title);
        newPlan.setDescription(description);
        newPlan.setAuthor(author);
        newPlan.setAuthorNote(authorNote);
        newPlan.setCourseCategory(courseCategory);
        newPlan.setCourseType(courseType);
        newPlan.setCourseFee("paid".equals(courseType) ? courseFee : null); // Set course fee if paid
        newPlan.setThumbnail(thumbnailPath); // Store the path to the uploaded thumbnail

        // Save the learning plan and return the saved plan
        LearningPlan savedPlan = service.createPlan(newPlan);
        return ResponseEntity.ok(savedPlan); // Return saved plan as a response
    }

    // PUT - Update an existing Learning Plan by ID
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updatePlan(@PathVariable String id, @RequestBody LearningPlan plan) {
        LearningPlan updatedPlan = service.updatePlan(id, plan);
        if (updatedPlan != null) {
            return ResponseEntity.ok(updatedPlan); // Return updated plan
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Return 404 if plan not found
    }

    // DELETE - Delete a Learning Plan by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlan(@PathVariable String id) {
        boolean deleted = service.deletePlan(id);
        if (deleted) {
            return ResponseEntity.ok("Plan deleted successfully.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plan not found.");
    }

    // Helper method to handle file saving
    private String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return null; // Return null if no file is uploaded
        }

        // Specify the file destination (you can change this to use cloud storage like AWS S3)
        String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
        String filePath = "uploads/" + fileName;

        // Save the file to the server's local filesystem
        file.transferTo(new java.io.File(filePath));

        return filePath; // Return the file path or URL
    }
}
