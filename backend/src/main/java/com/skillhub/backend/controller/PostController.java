package com.skillhub.backend.controller;

import com.skillhub.backend.model.Post;
import com.skillhub.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.mongodb.client.gridfs.model.GridFSFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    // Create post with optional media
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Post> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "media", required = false) MultipartFile mediaFile) throws IOException {

        Post post = new Post();
        post.setContent(content);
        post.setCreatedAt(LocalDateTime.now());

        if (mediaFile != null && !mediaFile.isEmpty()) {
            String fileId = gridFsTemplate
                    .store(mediaFile.getInputStream(), mediaFile.getOriginalFilename(), mediaFile.getContentType())
                    .toString();

            if (Objects.requireNonNull(mediaFile.getContentType()).startsWith("video")) {
                post.setVideoUrl("/api/posts/media/" + fileId);
            } else if (mediaFile.getContentType().startsWith("image")) {
                post.setImageUrl("/api/posts/media/" + fileId);
            }
        }

        return ResponseEntity.ok(postRepository.save(post));
    }

    // Retrieve all posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postRepository.findAll());
    }

    // Retrieve a specific post
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post updatedPost) {
        return postRepository.findById(id)
                .map(existingPost -> {
                    existingPost.setContent(updatedPost.getContent());
                    existingPost.setVisibility(updatedPost.getVisibility());
                    return ResponseEntity.ok(postRepository.save(existingPost));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Retrieve media from GridFS
    @GetMapping("/media/{id}")
    public ResponseEntity<?> getMediaById(@PathVariable String id) throws IOException {
        GridFSFile file = gridFsTemplate.findOne(
                org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id)));
        if (file == null)
            return ResponseEntity.notFound().build();

        GridFsResource resource = gridFsTemplate.getResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(Objects.requireNonNull(resource.getContentType())))
                .body(new InputStreamResource(resource.getInputStream()));
    }
}
