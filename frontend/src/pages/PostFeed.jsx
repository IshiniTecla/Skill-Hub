import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/posts");
                const data = await res.json();

                if (res.ok) {
                    setPosts(data.reverse()); // reverse for newest first
                } else {
                    setError("Failed to fetch posts");
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Server error");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p style={{ color: "red", fontSize: "16px" }}>{error}</p>;

    return (
        <div style={{ padding: "2rem", backgroundColor: "#f4f4f9" }}>
            <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>Your Posts</h2>
            {posts.length === 0 ? (
                <p style={{ fontSize: "18px", textAlign: "center", color: "#777" }}>No posts found.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "20px", color: "#333", marginBottom: "0.5rem" }}>{post.title}</h3>
                        <p style={{ fontSize: "16px", color: "#555", marginBottom: "1rem" }}>{post.content}</p>
                        
                        {/* Display image or video preview */}
                        {post.media && post.media.type.startsWith("image") && (
                            <img src={post.media.url} alt="Post Media" style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }} />
                        )}
                        {post.media && post.media.type.startsWith("video") && (
                            <video controls style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}>
                                <source src={post.media.url} type={post.media.type} />
                            </video>
                        )}
                        
                        <Link
                            to={`/post/${post.id}`}
                            style={{
                                fontSize: "16px",
                                color: "#007bff",
                                textDecoration: "none",
                                fontWeight: "bold",
                            }}
                        >
                            View Post
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default PostFeed;
