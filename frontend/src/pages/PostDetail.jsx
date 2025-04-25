import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PostDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/posts/${postId}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data);
                } else {
                    alert("Failed to fetch post details");
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Server error");
            }
        };

        fetchPostDetails();
    }, [postId]);

    if (!post) {
        return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
    }

    return (
        <div style={{ padding: "2rem", display: "flex", justifyContent: "center", backgroundColor: "#f4f7fc" }}>
            <div 
                style={{
                    background: "#fff",
                    padding: "2rem",
                    borderRadius: "16px",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    border: "1px solid #ddd",
                    width: "100%",
                    maxWidth: "700px",
                    margin: "1rem",
                    textAlign: "center",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
            >
                <h2 style={{ fontSize: "1.8rem", color: "#333", fontWeight: "600" }}>{post.content}</h2>

                {/* Media - Image */}
                {post.media && post.media.type.startsWith("image") && (
                    <img
                        src={post.media.url}
                        alt="Post Media"
                        style={{
                            width: "100%",
                            maxHeight: "450px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            marginTop: "1.5rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            transition: "transform 0.3s ease-in-out",
                        }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    />
                )}

                {/* Media - Video */}
                {post.media && post.media.type.startsWith("video") && (
                    <video
                        controls
                        style={{
                            width: "100%",
                            maxHeight: "450px",
                            borderRadius: "12px",
                            marginTop: "1.5rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        }}
                    >
                        <source src={post.media.url} type={post.media.type} />
                    </video>
                )}

                <p style={{ fontSize: "1rem", color: "#555", marginTop: "1rem" }}>
                    <strong>Visibility:</strong> {post.visibility}
                </p>
                <p style={{ fontSize: "1rem", color: "#555", marginTop: "0.5rem" }}>
                    <strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default PostDetailPage;
