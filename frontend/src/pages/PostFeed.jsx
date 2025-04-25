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
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Your Posts</h2>
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} style={{ marginBottom: "20px" }}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        
                        {/* Display image or video preview */}
                        {post.media && post.media.type.startsWith("image") && (
                            <img src={post.media.url} alt="Post Media" />
                        )}
                        {post.media && post.media.type.startsWith("video") && (
                            <video controls style={{ width: "100%", borderRadius: "8px", marginTop: "0.5rem" }}>
                                <source src={post.media.url} type={post.media.type} />
                            </video>
                        )}
                        <br />
                        <Link to={`/post/${post.id}`}>View Post</Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default PostFeed;
