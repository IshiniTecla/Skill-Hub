package com.skillhub.backend.service;

import com.skillhub.backend.model.LearningPlan;
import com.skillhub.backend.repository.LearningPlanRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepo repository;

    // CREATE - Save a new Learning Plan
    public LearningPlan createPlan(LearningPlan plan) {
        return repository.save(plan);
    }

    // READ - Get all Learning Plans
    public List<LearningPlan> getAllPlans() {
        return repository.findAll();
    }

    // READ - Get a single Learning Plan by ID
    public Optional<LearningPlan> getPlanById(String id) {
        return repository.findById(id);
    }

    // UPDATE - Update an existing Learning Plan by ID
    public LearningPlan updatePlan(String id, LearningPlan updatedPlan) {
        Optional<LearningPlan> existingPlan = repository.findById(id);
        if (existingPlan.isPresent()) {
            LearningPlan plan = existingPlan.get();
            plan.setTitle(updatedPlan.getTitle());
            plan.setDescription(updatedPlan.getDescription());
            plan.setAuthor(updatedPlan.getAuthor());
            plan.setAuthorNote(updatedPlan.getAuthorNote());
            plan.setCourseCategory(updatedPlan.getCourseCategory());
            plan.setCourseType(updatedPlan.getCourseType());
            plan.setCourseFee(updatedPlan.getCourseFee());
            return repository.save(plan);
        }
        throw new IllegalArgumentException("Plan not found for ID: " + id); // Custom exception for better error handling
    }

    // DELETE - Delete a Learning Plan by ID
    public boolean deletePlan(String id) {
        Optional<LearningPlan> plan = repository.findById(id);
        if (plan.isPresent()) {
            repository.deleteById(id);
            return true;
        }
        throw new IllegalArgumentException("Plan not found for ID: " + id); // Custom exception for better error handling
    }
}
