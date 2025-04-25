import React from "react";

const PostItem = ({ post, onDelete, onEdit, onComment, onLike, onRepost, onShare }) => {
    return (
        <div style={{
            border: "1px solid #e1e4e8",
            padding: "1.2rem",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)"
        }}>
            <p style={{ fontSize: "1rem", marginBottom: "0.8rem" }}>{post.content}</p>

            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt="Post media"
                    style={{ width: "100%", borderRadius: "10px", marginTop: "0.5rem" }}
                />
            )}

            {post.videoUrl && (
                <video
                    src={post.videoUrl}
                    controls
                    width="100%"
                    style={{ borderRadius: "10px", marginTop: "0.5rem" }}
                />
            )}

            <div style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "1rem",
                marginTop: "0.75rem"
            }}>
                <button
                    onClick={onLike}
                    style={{
                        background: "#007bff",
                        border: "none",
                        color: "#fff",
                        padding: "0.5rem 1rem",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Like
                </button>
                <button
                    onClick={onComment}
                    style={{
                        background: "#28a745",
                        border: "none",
                        color: "#fff",
                        padding: "0.5rem 1rem",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Comment
                </button>
                <button
                    onClick={onRepost}
                    style={{
                        background: "#17a2b8",
                        border: "none",
                        color: "#fff",
                        padding: "0.5rem 1rem",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Repost
                </button>
                <button
                    onClick={onShare}
                    style={{
                        background: "#ffc107",
                        border: "none",
                        color: "#fff",
                        padding: "0.5rem 1rem",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Share
                </button>
            </div>
<div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginTop: "0.75rem"
            }}>
                <button
                    onClick={onEdit}
                    style={{
                        background: "#ffc107",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    style={{
                        background: "#dc3545",
                        border: "none",
                        color: "#fff",
                        padding: "0.5rem 1rem",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default PostItem;