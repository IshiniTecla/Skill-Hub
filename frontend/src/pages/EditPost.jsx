import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState("anyone");
    const [imageUrl, setImageUrl] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/posts/${id}`);
                if (!res.ok) throw new Error("Failed to fetch post");
                const data = await res.json();
                setContent(data.content);
                setVisibility(data.visibility);
                setImageUrl(data.imageUrl);
            } catch (err) {
                console.error("Error fetching post:", err);
                setSuccessMessage("Failed to load post for editing.");
            }
        };

        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:8080/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content, visibility }),
            });

            if (res.ok) {
                setSuccessMessage("✅ Post updated successfully!");
                setTimeout(() => navigate("/view"), 1500); // redirect after short delay
            } else {
                const data = await res.json();
                setSuccessMessage(`❌ Update failed: ${data.message || "Unknown error"}`);
            }
        } catch (err) {
            console.error("Error during post update:", err);
            setSuccessMessage("❌ Server error during update.");
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h2>Edit Post</h2>

            {/* Success/Error message */}
            {successMessage && (
                <div style={{
                    marginBottom: '1rem',
                    padding: '10px',
                    backgroundColor: successMessage.includes("successfully") ? "#d4edda" : "#f8d7da",
                    color: successMessage.includes("successfully") ? "#155724" : "#721c24",
                    border: `1px solid ${successMessage.includes("successfully") ? "#c3e6cb" : "#f5c6cb"}`,
                    borderRadius: "5px"
                }}>
                    {successMessage}
                </div>
            )}

            {/* Image Preview */}
            {imageUrl && (
                <div style={{ marginBottom: '1rem' }}>
                    <img src={imageUrl} alt="Post" style={{ width: "25%", borderRadius: "8px" }} />
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="5"
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "10px",
                        fontSize: "1rem",
                        backgroundColor: "#fff"
                    }}
                />
                <br />
                <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    style={{
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        marginBottom: "20px",
                        fontSize: "1rem"
                    }}
                >
                    <option value="anyone">Anyone</option>
                    <option value="friends">Friends</option>
                    <option value="onlyMe">Only Me</option>
                </select>
                <br />
                <button type="submit" style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}>Update Post</button>
            </form>
        </div>
    );
};

export default EditPost;
