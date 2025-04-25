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

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private GridFsTemplate gridFsTemplate;

    // Create post with media file
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Post> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "media", required = false) MultipartFile mediaFile) throws IOException {

        Post post = new Post();
        post.setContent(content);
        post.setCreatedAt(LocalDateTime.now());

        // Save media file to MongoDB GridFS if it exists
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

        // Save the post with media reference to MongoDB
        return ResponseEntity.ok(postRepository.save(post));
    }

    // Get all posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postRepository.findAll());
    }

    // Retrieve media by file ID from GridFS
    @GetMapping("/media/{id}")
    public ResponseEntity<?> getMediaById(@PathVariable String id) throws IOException {
        GridFSFile file = gridFsTemplate.findOne(
                org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("_id").is(id)));
        if (file == null)
            return ResponseEntity.notFound().build();

        // Retrieve the file as GridFsResource
        GridFsResource resource = gridFsTemplate.getResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(Objects.requireNonNull(resource.getContentType())))
                .body(new InputStreamResource(resource.getInputStream()));
    }
}
