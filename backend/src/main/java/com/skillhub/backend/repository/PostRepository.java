package com.skillhub.backend.repository;

import com.skillhub.backend.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    // You can define custom query methods here if needed
}
