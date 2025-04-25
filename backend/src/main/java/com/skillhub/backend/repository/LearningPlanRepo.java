package com.skillhub.backend.repository;
import com.skillhub.backend.model.LearningPlan;


import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningPlanRepo extends MongoRepository<LearningPlan, String> {
}
    

