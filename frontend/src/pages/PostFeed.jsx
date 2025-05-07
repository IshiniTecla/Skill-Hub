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
                    setPosts(data.reverse()); // newest posts first
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
            {posts.length === 0 ? (
                <p style={{ fontSize: "18px", textAlign: "center", color: "#777" }}>
                    No posts found.
                </p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)", // 4 columns layout
                        gap: "1.5rem",
                    }}
                >
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                backgroundColor: "#fff",
                                padding: "1rem",
                                borderRadius: "8px",
                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                                marginBottom: "20px",
                                position: "relative",
                                textAlign: "center",
                            }}
                        >
                            <p style={{ fontSize: "16px", color: "#555", marginBottom: "1rem" }}>
                                {post.content}
                            </p>

                            {/* Show image if available */}
                            {post.imageUrl && (
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={`http://localhost:8080${post.imageUrl}`}
                                        alt="Post"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "contain",
                                            borderRadius: "8px",
                                            marginBottom: "1rem",
                                        }}
                                    />
                                </div>
                            )}

                            {/* Show video if available */}
                            {post.videoUrl && (
                                <div style={{ position: "relative" }}>
                                    <video
                                        controls
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            borderRadius: "8px",
                                            marginBottom: "1rem",
                                            objectFit: "contain",
                                        }}
                                    >
                                        <source
                                            src={`http://localhost:8080${post.videoUrl}`}
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}

                            {/* Like, Comment, Share */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "1.5rem",
                                    fontSize: "16px",
                                    color: "#007bff",
                                    cursor: "pointer",
                                    paddingTop: "10px",
                                    textAlign: "center",
                                }}
                            >
                                <span>👍 Like</span>
                                <span>💬 Comment</span>
                                <span>🔗 Share</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostFeed;
