import React, { useState } from "react";

const SkillForm = ({ onAddSkill }) => {
    const [skillName, setSkillName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!skillName.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: skillName }),
            });

            if (!res.ok) throw new Error("Failed to add skill");

            const data = await res.json();
            if (onAddSkill) onAddSkill(data); // ← fixed to match SkillList prop
            setSkillName("");
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <input
                type="text"
                placeholder="Enter a skill (e.g., Java, React)"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                style={inputStyle}
                required
            />
            <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? "Adding..." : "Add Skill"}
            </button>
        </form>
    );
};

// === Inline CSS ===
const formStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "#f7f9fc",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)"
};

const inputStyle = {
    flex: 1,
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border 0.3s ease",
};

const buttonStyle = {
    backgroundColor: "#0073b1",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
};

export default SkillForm;
