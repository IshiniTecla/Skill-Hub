import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagePost = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/posts");
            const data = await res.json();
            if (res.ok) setPosts(data.reverse());
        } catch (err) {
            alert("Error loading posts");
        }
    };

    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setPosts(posts.filter((p) => p.id !== postId));
            } else {
                alert("Delete failed");
            }
        } catch (err) {
            alert("Server error");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Manage Your Posts</h2>
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} style={{
                        border: "1px solid #ddd",
                        padding: "1rem",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                        backgroundColor: "#f9f9f9"
                    }}>
                        <h3>{post.title || "Untitled Post"}</h3>
                        <p>{post.content}</p>

                        {/* Optional media */}
                        {post.media && post.media.type.startsWith("image") && (
                            <img src={post.media.url} alt="Post" style={{ maxWidth: "100%", marginBottom: "1rem" }} />
                        )}
                        {post.media && post.media.type.startsWith("video") && (
                            <video controls style={{ maxWidth: "100%", marginBottom: "1rem" }}>
                                <source src={post.media.url} type={post.media.type} />
                            </video>
                        )}

                        <button
                            style={{ marginRight: "1rem", padding: "0.5rem 1rem", backgroundColor: "#ffc107", border: "none", borderRadius: "4px", cursor: "pointer" }}
                            onClick={() => navigate(`/edit/${post.id}`)}
                        >
                            Update
                        </button>
                        <button
                            style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", border: "none", borderRadius: "4px", color: "#fff", cursor: "pointer" }}
                            onClick={() => handleDelete(post.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default ManagePost;
