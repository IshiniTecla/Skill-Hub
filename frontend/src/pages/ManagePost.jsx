import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManagePost = () => {
    const [posts, setPosts] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [message, setMessage] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const navigate = useNavigate();

    const showMessage = (text, type = 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const fetchPosts = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/posts");
            const data = await res.json();
            if (res.ok) setPosts(data.reverse());
        } catch (err) {
            showMessage("Error loading posts");
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/posts/${postIdToDelete}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setPosts(posts.filter((p) => p.id !== postIdToDelete));
                showMessage("Post deleted successfully!", 'success');
            } else {
                showMessage("Delete failed", 'error');
            }
        } catch (err) {
            showMessage("Server error", 'error');
        }
        setShowConfirmDelete(false);
    };

    const toggleMenu = (postId) => {
        setActiveMenu(activeMenu === postId ? null : postId);
    };

    const confirmDelete = (postId) => {
        setPostIdToDelete(postId);
        setShowConfirmDelete(true);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}></h2>

            {message && (
                <div
                    style={{
                        backgroundColor: message.type === 'success' ? "#d4edda" : "#f8d7da",
                        color: message.type === 'success' ? "#155724" : "#721c24",
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "1rem",
                        textAlign: "center",
                        border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                    }}
                >
                    {message.text}
                </div>
            )}

            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns layout
                        gap: '1.5rem',
                    }}
                >
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "1rem",
                                borderRadius: "8px",
                                backgroundColor: "#f9f9f9",
                                position: "relative",
                                textAlign: "center"
                            }}
                        >
                            <p>{post.content}</p>

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
                                            margin: "1rem 0"
                                        }}
                                    />

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
                                                onClick={() => confirmDelete(post.id)}
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

                            {post.videoUrl && (
                                <video
                                    controls
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        borderRadius: "8px",
                                        margin: "1rem 0",
                                        objectFit: "contain"
                                    }}
                                >
                                    <source src={`http://localhost:8080${post.videoUrl}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showConfirmDelete && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "2rem",
                            borderRadius: "8px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                            textAlign: "center",
                            width: "300px"
                        }}
                    >
                        <h3>Are you sure you want to delete this post?</h3>
                        <div style={{ marginTop: "1rem" }}>
                            <button
                                onClick={handleDelete}
                                style={{
                                    marginRight: "10px",
                                    padding: "10px 20px",
                                    backgroundColor: "#dc3545",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePost;
