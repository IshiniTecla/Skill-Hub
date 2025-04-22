import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave } from "react-icons/fa"; // Removed FaTrash

const SkillFormCard = ({ editMode = false }) => {
    const [skillName, setSkillName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (editMode && id) {
            fetch(`http://localhost:8080/api/skills/${id}`)
                .then((res) => res.json())
                .then((data) => setSkillName(data.name))
                .catch(() => alert("Failed to load skill"));
        }
    }, [editMode, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!skillName.trim()) return;

        setLoading(true);
        try {
            const url = editMode
                ? `http://localhost:8080/api/skills/${id}`
                : "http://localhost:8080/api/skills";
            const method = editMode ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: skillName }),
            });
            if (!res.ok) throw new Error("Failed to save skill");
            navigate("/skill-card");
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={cardContainer}>
            <h2 style={cardHeader}>{editMode ? "Edit Skill" : "Add New Skill"}</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="text"
                    value={skillName}
                    placeholder="e.g. React, Java"
                    onChange={(e) => setSkillName(e.target.value)}
                    required
                    style={inputStyle}
                />

                <div style={buttonsRow}>
                    <button
                        type="submit"
                        style={saveBtnStyle}
                        disabled={loading}
                        title={editMode ? "Save changes" : "Add skill"}
                    >
                        <FaSave style={{ marginRight: 6 }} />
                        {loading
                            ? editMode
                                ? "Updating..."
                                : "Adding..."
                            : editMode
                                ? "Update Skill"
                                : "Add Skill"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SkillFormCard;

// === Inline Styles ===
const cardContainer = {
    maxWidth: 400,
    margin: "2rem auto",
    padding: "1.5rem",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontFamily: "'Segoe UI', sans-serif",
    border: "1px solid #e1e4e8",
};

const cardHeader = {
    margin: 0,
    marginBottom: "1rem",
    fontSize: "1.5rem",
    color: "#222",
    textAlign: "center",
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
};

const inputStyle = {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: 6,
    border: "1px solid #ccc",
    outline: "none",
};

const buttonsRow = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const saveBtnStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0073b1",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
};
