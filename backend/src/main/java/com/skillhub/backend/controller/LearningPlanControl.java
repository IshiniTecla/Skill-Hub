package com.skillhub.backend.controller;

import com.skillhub.backend.model.LearningPlan;
import com.skillhub.backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public LearningPlan getPlanById(@PathVariable String id) {
        return service.getPlanById(id).orElse(null); 
    }

    // POST - Create a new Learning Plan
    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan) {
        return service.createPlan(plan);
    }

    // PUT - Update an existing Learning Plan by ID
    @PutMapping("/{id}")
    public LearningPlan updatePlan(@PathVariable String id, @RequestBody LearningPlan plan) {
        return service.updatePlan(id, plan);
    }

    // DELETE - Delete a Learning Plan by ID
    @DeleteMapping("/{id}")
    public String deletePlan(@PathVariable String id) {
        if(service.deletePlan(id)) {
            return "Plan deleted successfully.";
        }
        return "Plan not found.";
    }
}
