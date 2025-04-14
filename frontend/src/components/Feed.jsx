import React, { useState, useEffect } from "react";
import PostForm from "../pages/PostForm";
import PostList from "../pages/PostList";

const Feed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/posts")
            .then((res) => res.json())
            .then((data) => setPosts(data.reverse())) // show newest first
            .catch((err) => console.error("Failed to load posts:", err));
    }, []);

    const handlePostSubmit = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handleDeletePost = (id) => {
        fetch(`http://localhost:8080/api/posts/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                setPosts(posts.filter((post) => post.id !== id));
            })
            .catch((err) => console.error("Delete error:", err));
    };

    const handleEditPost = (id) => {
        const content = prompt("Edit your post");
        if (content) {
            fetch(`http://localhost:8080/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            })
                .then((res) => res.json())
                .then((updated) => {
                    const updatedPosts = posts.map((post) =>
                        post.id === id ? updated : post
                    );
                    setPosts(updatedPosts);
                })
                .catch((err) => console.error("Update error:", err));
        }
    };

    const handleLikePost = (id) => {
        // Handle like action (e.g., increment the like count)
        console.log(`Liked post with id: ${id}`);
    };

    const handleCommentPost = (id) => {
        // Handle comment action (e.g., show comment input form)
        console.log(`Commented on post with id: ${id}`);
    };

    const handleRepostPost = (id) => {
        // Handle repost action
        console.log(`Reposted post with id: ${id}`);
    };

    const handleSharePost = (id) => {
        // Handle share action (e.g., open share modal or link)
        console.log(`Shared post with id: ${id}`);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Your Feed</h2>
            <PostForm onPostSubmit={handlePostSubmit} />
            <PostList
                posts={posts}
                onDeletePost={handleDeletePost}
                onEditPost={handleEditPost}
                onLikePost={handleLikePost}
                onCommentPost={handleCommentPost}
                onRepostPost={handleRepostPost}
                onSharePost={handleSharePost}
            />
        </div>
    );
};

export default Feed;
