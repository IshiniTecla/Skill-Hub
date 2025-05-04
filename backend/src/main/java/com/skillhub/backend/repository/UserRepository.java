package com.skillhub.backend.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillhub.backend.models.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    User findByEmailAndPassword(String email, String password);
}

