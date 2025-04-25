import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [visibility, setVisibility] = useState("anyone");

    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch(`http://localhost:8080/api/posts/${id}`);
            const data = await res.json();
            if (res.ok) {
                setContent(data.content);
                setVisibility(data.visibility);
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
                navigate("/view");
            } else {
                alert("Update failed");
            }
        } catch (err) {
            alert("Server error");
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="5"
                    required
                    style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
                />
                <br />
                <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                    <option value="anyone">Anyone</option>
                    <option value="friends">Friends</option>
                    <option value="onlyMe">Only Me</option>
                </select>
                <br /><br />
                <button type="submit">Update Post</button>
            </form>
        </div>
    );
};

export default EditPost;
