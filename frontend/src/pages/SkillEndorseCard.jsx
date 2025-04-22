import React, { useEffect, useState } from "react";

const SkillEndorseCard = () => {
    const [skills, setSkills] = useState([]);
    const [endorsedSkills, setEndorsedSkills] = useState([]);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/skills");
            const data = await res.json();
            setSkills(data);
        } catch (err) {
            console.error("Failed to fetch skills", err);
        }
    };

    const handleEndorse = async (skillId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/skills/${skillId}/endorse`, {
                method: "POST",
            });

            if (!res.ok) throw new Error("Failed to endorse");

            const updatedSkill = await res.json();
            setSkills((prev) =>
                prev.map((s) => (s.id === skillId ? updatedSkill : s))
            );
            setEndorsedSkills((prev) => [...prev, skillId]);
        } catch (err) {
            alert("Could not endorse the skill.");
        }
    };

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <h3 style={titleStyle}>Skills</h3>
            </div>

            {skills.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999" }}>No skills available to endorse.</p>
            ) : (
                skills.map((skill) => (
                    <div key={skill.id} style={skillItemStyle}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {skill.iconUrl && (
                                <img src={skill.iconUrl} alt={skill.name} style={logoStyle} />
                            )}
                            <div style={skillTextGroup}>
                                <span style={skillNameStyle}>{skill.name}</span>
                                <span style={skillSourceStyle}>
                                    {skill.source || "Endorsed by community"}
                                </span>
                            </div>
                        </div>

                        <button
                            style={{
                                ...endorseBtn,
                                backgroundColor: endorsedSkills.includes(skill.id)
                                    ? "#28a745"
                                    : "#0073b1",
                            }}
                            onClick={() => handleEndorse(skill.id)}
                            disabled={endorsedSkills.includes(skill.id)}
                        >
                            {endorsedSkills.includes(skill.id) ? "Endorsed ✅" : "Endorse"}
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default SkillEndorseCard;

// === Inline Styles ===
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
    display: "flex",
    flexDirection: "column",
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

const endorseBtn = {
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "0.95rem",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
};
