import React, { useEffect, useState } from "react";

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

    if (loading) return <p style={{ textAlign: "center" }}>Loading posts...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
            <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>Your Posts</h2>
            {posts.length === 0 ? (
                <p style={{ textAlign: "center" }}>No posts found.</p>
            ) : (
                posts.map((post, index) => (
                    <div
                        key={index}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "1rem",
                            marginBottom: "1rem",
                            background: "#fff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        <p><strong>Content:</strong> {post.content}</p>
                        <p><strong>Visibility:</strong> {post.visibility}</p>
                        {post.mediaUrl && (
                            <div style={{ marginTop: "1rem" }}>
                                {post.mediaUrl.endsWith(".mp4") ? (
                                    <video width="100%" controls>
                                        <source src={post.mediaUrl} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img
                                        src={post.mediaUrl}
                                        alt="Post"
                                        style={{ width: "100%", borderRadius: "6px" }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default PostFeed;
