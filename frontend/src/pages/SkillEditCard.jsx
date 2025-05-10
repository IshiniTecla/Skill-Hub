import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaArrowLeft } from "react-icons/fa";

const SkillEditCard = () => {
    const { id } = useParams();
    const [skill, setSkill] = useState(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/skills/${id}`)
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
            const res = await fetch(`/api/skills/${id}`, {
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


    if (!skill) return <p>Loading...</p>;

    return (
        <div style={cardStyle}>
            <button onClick={() => navigate(-1)} style={backBtn} title="Go Back">
                <FaArrowLeft />
            </button>

            <h2 style={cardHeader}>Edit Skill</h2>

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

            </div>
        </div>
    );
};

export default SkillEditCard;

// === Inline Styles ===
const cardStyle = {
    maxWidth: "450px",
    margin: "2rem auto",
    padding: "2rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
    border: "1px solid #e1e4e8",
};

const backBtn = {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#f0f2f5",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "background 0.3s",
};

const cardHeader = {
    margin: "0 0 1.5rem 0",
    fontSize: "1.5rem",
    color: "#222",
    textAlign: "center",
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
