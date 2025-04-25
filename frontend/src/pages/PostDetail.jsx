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
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "2rem" }}>
            <div style={styles.card}>
                <h2>{post.content}</h2>
                {post.media && post.media.type.startsWith("image") && (
                    <img
                        src={post.media.url}
                        alt="Post Media"
                        style={styles.media}
                    />
                )}
                {post.media && post.media.type.startsWith("video") && (
                    <video controls style={styles.media}>
                        <source src={post.media.url} type={post.media.type} />
                    </video>
                )}
                <p><strong>Visibility:</strong> {post.visibility}</p>
                <p><strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}</p>
            </div>
        </div>
    );
};

const styles = {
    card: {
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        border: "1px solid #ddd",
        width: "100%",
        maxWidth: "600px",
        margin: "auto",
    },
    media: {
        width: "100%",
        borderRadius: "8px",
        marginTop: "1rem",
    },
};

export default PostDetailPage;
