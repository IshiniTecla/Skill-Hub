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
                maxWidth: "400px",
                margin: "20px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
            }}
        >
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                required
                style={{
                    padding: "10px",
                    fontSize: "16px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    resize: "vertical"
                }}
            />
            <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                style={{ marginBottom: "10px" }}
            />
            <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginBottom: "10px"
                }}
            >
                <option value="anyone">Anyone</option>
                <option value="friends">Friends</option>
                <option value="onlyMe">Only Me</option>
            </select>
            <button
                type="submit"
                style={{
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                Post
            </button>
        </form>
    );
};

export default PostForm;
