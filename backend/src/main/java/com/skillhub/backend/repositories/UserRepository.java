package com.skillhub.backend.repositories;

import com.skillhub.backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findBySkillsContaining(String skill);
    List<User> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
    List<User> findByFirstNameContainingOrLastNameContainingAndSkillsContaining(String firstName, String lastName, String skill);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}