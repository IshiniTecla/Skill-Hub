import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EndorseSkillForm = () => {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const [skill, setSkill] = useState(null);
    const [endorsement, setEndorsement] = useState({
        endorserName: "",
        comment: "",
        level: "Intermediate",
    });

    useEffect(() => {
        fetchSkill();
    }, []);

    const fetchSkill = async () => {
        try {
            const res = await fetch(`/api/skills/${skillId}`);
            const data = await res.json();
            setSkill(data);
        } catch (err) {
            console.error("Failed to fetch skill", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEndorsement((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/endorsements`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skillId, ...endorsement }),
            });

            if (!res.ok) throw new Error("Failed to submit endorsement");

            Swal.fire("Success", "Skill endorsed successfully!", "success");
            navigate("/skills-endorsements");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to endorse skill", "error");
        }
    };

    if (!skill) return <p>Loading skill...</p>;

    return (
        <div style={formCard}>
            <h2 style={formTitle}>Endorse: {skill.name}</h2>
            <form onSubmit={handleSubmit}>
                <div style={formGroup}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="endorserName"
                        value={endorsement.endorserName}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={formGroup}>
                    <label>Endorsement Level</label>
                    <select
                        name="level"
                        value={endorsement.level}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>

                <div style={formGroup}>
                    <label>Comment</label>
                    <textarea
                        name="comment"
                        value={endorsement.comment}
                        onChange={handleChange}
                        rows="3"
                        style={inputStyle}
                    ></textarea>
                </div>

                <button type="submit" style={submitBtn}>Submit Endorsement</button>
            </form>
        </div>
    );
};

// Styles
const formCard = {
    background: "#fff",
    padding: "2rem",
    maxWidth: "500px",
    margin: "2rem auto",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    fontFamily: "'Segoe UI', sans-serif",
    border: "1px solid #eee",
};

const formTitle = {
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333",
};

const formGroup = {
    marginBottom: "1.2rem",
};

const inputStyle = {
    width: "100%",
    padding: "0.6rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginTop: "0.4rem",
};

const submitBtn = {
    padding: "0.7rem 1.4rem",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
};

export default EndorseSkillForm;
