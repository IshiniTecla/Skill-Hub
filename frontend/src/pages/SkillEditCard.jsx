// SkillEditCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";

const SkillEditCard = () => {
    const { id } = useParams();
    const [skill, setSkill] = useState(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8080/api/skills/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setSkill(data);
                setName(data.name);
            })
            .catch((err) => console.error("Error fetching skill:", err));
    }, [id]);

    const handleUpdate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/skills/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (res.ok) navigate("/skill-card");
            else throw new Error("Failed to update skill");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this skill?")) return;
        try {
            await fetch(`http://localhost:8080/api/skills/${id}`, { method: "DELETE" });
            navigate("/skill-card");
        } catch (err) {
            alert("Failed to delete skill");
        }
    };

    if (!skill) return <p>Loading...</p>;

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <button onClick={() => navigate(-1)} style={backBtn}>
                    <FaArrowLeft />
                </button>
                <h2>Edit Skill</h2>
            </div>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                placeholder="Skill name"
            />

            <div style={btnGroup}>
                <button onClick={handleUpdate} disabled={loading} style={updateBtn}>
                    <FaSave /> {loading ? "Updating..." : "Update"}
                </button>
                <button onClick={handleDelete} style={deleteBtn}>
                    <FaTrash /> Delete
                </button>
            </div>
        </div>
    );
};

// === Inline Styles ===
const cardStyle = {
    maxWidth: "450px",
    margin: "2rem auto",
    padding: "2rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontFamily: "'Segoe UI', sans-serif",
};

const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
};

const backBtn = {
    background: "none",
    border: "none",
    color: "#0073b1",
    fontSize: "0.9rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
};

const inputStyle = {
    width: "100%",
    padding: "0.8rem",
    fontSize: "1rem",
    marginBottom: "1.2rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
};

const btnGroup = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
};

const updateBtn = {
    backgroundColor: "#0073b1",
    color: "#fff",
    padding: "0.7rem 1.2rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
};

const deleteBtn = {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "0.7rem 1.2rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
};

export default SkillEditCard;
