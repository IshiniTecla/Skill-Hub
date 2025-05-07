import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SkillsEndorseCard = () => {
    const [skills, setSkills] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch("/api/skills");
            const data = await res.json();
            setSkills(data);
        } catch (err) {
            console.error("Failed to fetch skills", err);
        }
    };

    const handleEndorse = (skillId) => {
        // Navigate to endorsement form or handle inline logic
        navigate(`/endorse/${skillId}`);
    };

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <h3 style={titleStyle}>Skills & Endorsements</h3>
            </div>

            <div>
                {skills.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#999" }}>No skills available to endorse.</p>
                ) : (
                    skills.map((skill) => (
                        <div key={skill.id} style={skillItemStyle}>
                            {skill.iconUrl && (
                                <img src={skill.iconUrl} alt={skill.name} style={logoStyle} />
                            )}
                            <div style={skillTextGroup}>
                                <span style={skillNameStyle}>{skill.name}</span>
                                <span style={skillSourceStyle}>{skill.source || "Endorsed by community"}</span>
                            </div>
                            <div style={skillActions}>
                                <button
                                    onClick={() => handleEndorse(skill.id)}
                                    style={endorseBtn}
                                    title="Endorse this skill"
                                >
                                    Endorse
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Styles (same as before, except button style modified)
const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)",
    maxWidth: "540px",
    margin: "2rem auto",
    fontFamily: "'Segoe UI', sans-serif",
    border: "1px solid #e1e4e8",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
};

const titleStyle = {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#222",
};

const skillItemStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.8rem 1rem",
    border: "1px solid #eee",
    borderRadius: "8px",
    marginBottom: "0.9rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
    backgroundColor: "#fafafa",
};

const logoStyle = {
    width: "40px",
    height: "40px",
    objectFit: "contain",
    borderRadius: "8px",
    marginRight: "1rem",
    border: "1px solid #ddd",
};

const skillTextGroup = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginLeft: "1rem",
};

const skillNameStyle = {
    fontWeight: 600,
    fontSize: "1rem",
    color: "#333",
};

const skillSourceStyle = {
    fontSize: "0.85rem",
    color: "#777",
    marginTop: "0.2rem",
};

const skillActions = {
    display: "flex",
    gap: "0.5rem",
};

const endorseBtn = {
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem 0.9rem",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
};

export default SkillsEndorseCard;
