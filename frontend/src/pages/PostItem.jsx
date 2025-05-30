import React, { useState } from "react";

const PostForm = ({ onPostSubmit }) => {
    const [content, setContent] = useState("");
    const [media, setMedia] = useState(null);
    const [visibility, setVisibility] = useState("anyone");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("content", content);
        formData.append("visibility", visibility);
        if (media) {
            formData.append("media", media);
        }

        try {
            const res = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                onPostSubmit(); // Notify parent to refresh post feed
                setContent(""); // Clear form
                setMedia(null);
                setVisibility("anyone");
            } else {
                alert("Post failed: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Server error");
        }
    };

    const handleMediaChange = (e) => {
        setMedia(e.target.files[0]);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                backgroundColor: "#f9f9f9",
                marginBottom: "2rem",
                padding: "1.5rem",
                border: "1px solid #e1e4e8",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                width: "100%",
                maxWidth: "600px",
                margin: "auto",
            }}
        >
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                required
                style={{
                    width: "100%",
                    padding: "0.9rem",
                    fontSize: "1rem",
                    borderRadius: "6px",
                    border: "1px solid #d1d5da",
                    resize: "vertical",
                    marginBottom: "1rem",
                }}
            />
            <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                style={{
                    marginBottom: "1rem",
                    display: "block",
                    fontSize: "0.95rem",
                    padding: "0.5rem",
                    width: "100%",
                }}
            />
            {media && (
                <div style={{ marginTop: "1rem" }}>
                    <p>Preview:</p>
                    {media.type.startsWith("image") ? (
                        <img
                            src={URL.createObjectURL(media)}
                            alt="Preview"
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                marginTop: "0.5rem",
                            }}
                        />
                    ) : media.type.startsWith("video") ? (
                        <video
                            controls
                            style={{
                                width: "100%",
                                borderRadius: "8px",
                                marginTop: "0.5rem",
                            }}
                        >
                            <source
                                src={URL.createObjectURL(media)}
                                type={media.type}
                            />
                        </video>
                    ) : null}
                </div>
            )}
            <div style={{ marginTop: "1rem" }}>
                <label
                    style={{
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        display: "inline-block",
                    }}
                >
                    Who can view this post?
                </label>
                <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "0.7rem",
                        fontSize: "1rem",
                        borderRadius: "6px",
                        border: "1px solid #d1d5da",
                        marginTop: "0.5rem",
                    }}
                >
                    <option value="anyone">Anyone</option>
                    <option value="friends">Friends</option>
                    <option value="onlyMe">Only Me</option>
                </select>
            </div>
            <button
                type="submit"
                style={{
                    backgroundColor: "#0073b1",
                    color: "white",
                    padding: "0.7rem 1.5rem",
                    fontSize: "1rem",
                    border: "none",
                    borderRadius: "6px",
                    marginTop: "1rem",
                    cursor: "pointer",
                    float: "right",
                }}
            >
                Post
            </button>
        </form>
    );
};

export default PostForm;
