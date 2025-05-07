import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManagePost = () => {
    const [posts, setPosts] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
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

    const toggleMenu = (postId) => {
        setActiveMenu(activeMenu === postId ? null : postId);
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
                    <div
                        key={post.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "1rem",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                            backgroundColor: "#f9f9f9",
                            position: "relative",
                            textAlign: "center"
                        }}
                    >
                        <p>{post.content}</p>

                        {/* Image if available */}
                        {post.imageUrl && (
                            <div style={{ position: "relative", display: "inline-block" }}>
                                <img
                                    src={`http://localhost:8080${post.imageUrl}`}
                                    alt="Post"
                                    style={{
                                        width: "25%",
                                        height: "auto",
                                        objectFit: "contain",
                                        borderRadius: "8px",
                                        margin: "1rem auto",
                                        display: "block"
                                    }}
                                />

                                {/* 3-dot menu button */}
                                <button
                                    onClick={() => toggleMenu(post.id)}
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        background: "transparent",
                                        border: "none",
                                        fontSize: "20px",
                                        cursor: "pointer"
                                    }}
                                    title="More options"
                                >
                                    ⋮
                                </button>

                                {/* Menu dropdown */}
                                {activeMenu === post.id && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "40px",
                                            right: "10px",
                                            backgroundColor: "#fff",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                            borderRadius: "6px",
                                            overflow: "hidden",
                                            zIndex: 999
                                        }}
                                    >
                                        <button
                                            onClick={() => navigate(`/edit/${post.id}`)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                width: "100%",
                                                padding: "10px",
                                                border: "none",
                                                backgroundColor: "#ffc107",
                                                color: "#000",
                                                borderBottom: "1px solid #ccc",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <FaEdit /> Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                width: "100%",
                                                padding: "10px",
                                                border: "none",
                                                backgroundColor: "#dc3545",
                                                color: "#fff",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Video if available */}
                        {post.videoUrl && (
                            <video
                                controls
                                style={{
                                    width: "25%",
                                    height: "auto",
                                    borderRadius: "8px",
                                    margin: "1rem auto",
                                    objectFit: "contain",
                                    display: "block"
                                }}
                            >
                                <source src={`http://localhost:8080${post.videoUrl}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ManagePost;
