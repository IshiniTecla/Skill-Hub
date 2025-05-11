import React, { useEffect, useState } from "react";

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeCommentBox, setActiveCommentBox] = useState(null);
    const [commentText, setCommentText] = useState({});
    const [shareSuccessId, setShareSuccessId] = useState(null);
    const [likes, setLikes] = useState({});
    const [commentSuccessId, setCommentSuccessId] = useState(null); // ✅ new

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/posts");
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.reverse());
                    const initialLikes = {};
                    data.forEach(post => initialLikes[post.id] = false);
                    setLikes(initialLikes);
                } else {
                    setError("Failed to fetch posts.");
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Server error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleLike = (postId) => {
        setLikes(prev => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const handleCommentClick = (postId) => {
        setActiveCommentBox(prevId => (prevId === postId ? null : postId));
    };

    const handleCommentChange = (postId, text) => {
        setCommentText({ ...commentText, [postId]: text });
    };

    const handleCommentSubmit = (postId) => {
        const comment = commentText[postId];
        if (!comment || comment.trim() === "") return;

        console.log("Comment submitted for post", postId, ":", comment);

        // ✅ Simulate backend send (you can replace with real API call)
        setCommentSuccessId(postId);
        setTimeout(() => setCommentSuccessId(null), 2000);

        setCommentText({ ...commentText, [postId]: "" });
    };

    const handleShare = async (postId) => {
        const shareUrl = `${window.location.origin}/posts/${postId}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareSuccessId(postId);
            setTimeout(() => setShareSuccessId(null), 2000);
        } catch (err) {
            console.error("Failed to copy to clipboard:", err);
        }
    };

    if (loading) return <p style={styles.loading}>Loading posts...</p>;
    if (error) return <p style={styles.error}>{error}</p>;

    return (
        <div style={styles.container}>
            {posts.length === 0 ? (
                <p style={styles.noPosts}>No posts found.</p>
            ) : (
                <div style={styles.grid}>
                    {posts.map((post) => (
                        <div key={post.id} style={styles.card}>
                            <p style={styles.content}>{post.content}</p>

                            {post.imageUrl && (
                                <img
                                    src={`http://localhost:8080${post.imageUrl}`}
                                    alt="Post"
                                    style={styles.media}
                                />
                            )}

                            {post.videoUrl && (
                                <video controls style={styles.media}>
                                    <source
                                        src={`http://localhost:8080${post.videoUrl}`}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            )}

                            <div style={styles.actions}>
                                <span
                                    role="button"
                                    onClick={() => handleLike(post.id)}
                                    style={{
                                        color: likes[post.id] ? "#28a745" : "#007bff",
                                    }}
                                >
                                    {likes[post.id] ? "❤️ Liked" : "👍 Like"}
                                </span>
                                <span role="button" onClick={() => handleCommentClick(post.id)}>
                                    💬 Comment
                                </span>
                                <span role="button" onClick={() => handleShare(post.id)}>
                                    🔗 Share
                                </span>
                            </div>

                            {shareSuccessId === post.id && (
                                <p style={styles.successMsg}>🔗 Link copied to clipboard!</p>
                            )}

                            {activeCommentBox === post.id && (
                                <div style={styles.commentBox}>
                                    <textarea
                                        placeholder="Write a comment..."
                                        value={commentText[post.id] || ""}
                                        onChange={(e) =>
                                            handleCommentChange(post.id, e.target.value)
                                        }
                                        style={styles.textarea}
                                    />
                                    <button
                                        onClick={() => handleCommentSubmit(post.id)}
                                        style={styles.commentButton}
                                    >
                                        Submit
                                    </button>

                                    {commentSuccessId === post.id && (
                                        <p style={styles.commentSuccess}>
                                            ✅ Comment submitted successfully!
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "2rem",
        backgroundColor: "#f4f4f9",
        minHeight: "100vh",
    },
    loading: {
        fontSize: "18px",
        textAlign: "center",
    },
    error: {
        color: "red",
        fontSize: "16px",
        textAlign: "center",
    },
    noPosts: {
        fontSize: "18px",
        color: "#777",
        textAlign: "center",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
    },
    card: {
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    content: {
        fontSize: "16px",
        color: "#333",
        marginBottom: "1rem",
        textAlign: "center",
    },
    media: {
        width: "100%",
        height: "auto",
        borderRadius: "8px",
        marginBottom: "1rem",
        objectFit: "contain",
    },
    actions: {
        display: "flex",
        justifyContent: "center",
        gap: "1.5rem",
        fontSize: "16px",
        color: "#007bff",
        cursor: "pointer",
        paddingTop: "10px",
    },
    commentBox: {
        marginTop: "1rem",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: "0.5rem",
    },
    textarea: {
        width: "100%",
        padding: "0.5rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        resize: "vertical",
    },
    commentButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "0.5rem",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
    },
    successMsg: {
        color: "green",
        fontSize: "14px",
        marginTop: "0.5rem",
    },
    commentSuccess: {
        color: "green",
        fontSize: "14px",
        textAlign: "center",
        marginTop: "0.5rem",
    },
};

export default PostFeed;
