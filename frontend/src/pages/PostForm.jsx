import React, { useState } from "react";

const PostForm = ({ onPostSubmit }) => {
    const [content, setContent] = useState("");
    const [media, setMedia] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [visibility, setVisibility] = useState("anyone");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("content", content);
        formData.append("visibility", visibility);
        if (media) {
            formData.append("media", media);
        }

        

            const data = await res.json();

            if (res.ok) {
                onPostSubmit(); // Notify parent to refresh post feed
                setContent("");
                setMedia(null);
                setPreviewURL(null);
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
        const file = e.target.files[0];
        setMedia(file);
        if (file) {
            setPreviewURL(URL.createObjectURL(file));
        } else {
            setPreviewURL(null);
        }
    };

    const renderPreview = () => {
        if (!previewURL) return null;

        if (media.type.startsWith("image/")) {
            return <img src={previewURL} alt="Preview" style={{ maxWidth: "100%", borderRadius: "10px" }} />;
        } else if (media.type.startsWith("video/")) {
            return (
                <video controls style={{ maxWidth: "100%", borderRadius: "10px" }}>
                    <source src={previewURL} type={media.type} />
                    Your browser does not support the video tag.
                </video>
            );
        } else {
            return <p>Unsupported file type.</p>;
        }
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
                placeholder="Title"
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

            {/* File Preview */}
            {renderPreview()}

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
