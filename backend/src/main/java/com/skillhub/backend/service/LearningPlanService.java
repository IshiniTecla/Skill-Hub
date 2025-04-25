package com.skillhub.backend.service;

import com.skillhub.backend.model.LearningPlan;
import com.skillhub.backend.repository.LearningPlanRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LearningPlanService {

    private final LearningPlanRepo repository;

    public LearningPlanService(LearningPlanRepo repository) {
        this.repository = repository;
    }

    public List<LearningPlan> getAllPlans() {
        return repository.findAll();
    }

    public LearningPlan getPlan(String id) {
        return repository.findById(id).orElse(null);
    }

    public LearningPlan createPlan(LearningPlan plan) {
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());
        return repository.save(plan);
    }

    public LearningPlan updatePlan(String id, LearningPlan updatedPlan) {
        LearningPlan plan = repository.findById(id).orElse(null);
        if (plan == null) return null;

        plan.setTitle(updatedPlan.getTitle());
        plan.setDescription(updatedPlan.getDescription());
        plan.setUpdatedAt(LocalDateTime.now());
        return repository.save(plan);
    }

    public void deletePlan(String id) {
        repository.deleteById(id);
    }
}
