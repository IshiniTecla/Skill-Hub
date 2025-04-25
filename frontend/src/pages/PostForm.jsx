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
                setContent("");
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
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                maxWidth: "500px",
                margin: "30px auto",
                padding: "24px",
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e0e0e0"
            }}
        >
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                required
                rows={4}
                style={{
                    padding: "12px",
                    fontSize: "15px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit",
                    backgroundColor: "#fdfdfd"
                }}
            />
            <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                style={{
                    fontSize: "14px",
                    padding: "6px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                }}
            />
            <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fafafa",
                    fontSize: "14px"
                }}
            >
                <option value="anyone">Anyone</option>
                <option value="friends">Friends</option>
                <option value="onlyMe">Only Me</option>
            </select>
            <button
                type="submit"
                style={{
                    padding: "12px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
            >
                Post
            </button>
        </form>
    );
};

export default PostForm;
