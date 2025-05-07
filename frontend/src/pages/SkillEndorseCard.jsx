import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const SkillsEndorseCard = () => {
    const [skills, setSkills] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSkillsWithEndorsements();
    }, []);

    const fetchSkillsWithEndorsements = async () => {
        try {
            const res = await fetch("/api/skills");
            const skillsData = await res.json();

            const skillsWithCounts = await Promise.all(
                skillsData.map(async (skill) => {
                    try {
                        const res = await fetch(`/api/endorsements/skill/${skill.endorseId}`);
                        const endorsements = await res.json();
                        return { ...skill, endorsementCount: endorsements.length, showActions: false };
                    } catch (err) {
                        console.error("Failed to fetch endorsements for skill", skill.id, err);
                        return { ...skill, endorsementCount: 0, showActions: false };
                    }
                })
            );

            setSkills(skillsWithCounts);
        } catch (err) {
            console.error("Failed to fetch skills", err);
        }
    };

    const handleEndorse = async (skillId, index) => {
        try {
            const res = await fetch(`/api/endorsements`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skillId }),
            });

            if (!res.ok) throw new Error("Failed to endorse skill");

            setSkills((prevSkills) => {
                const updatedSkills = [...prevSkills];
                updatedSkills[index] = {
                    ...updatedSkills[index],
                    endorsementCount: (updatedSkills[index].endorsementCount || 0) + 1,
                    showActions: true, // show Edit/Delete after endorsement
                };
                return updatedSkills;
            });

            navigate(`/endorse/${skillId}`);
        } catch (err) {
            console.error("Error endorsing skill:", err);
        }
    };

    const handleEdit = (skillId) => {
        navigate(`/edit-skill/${skillId}`);
    };

    const handleDelete = async (skillId) => {
        if (!window.confirm("Are you sure you want to delete this skill?")) return;
        try {
            const res = await fetch(`/api/skills/${skillId}`, { method: "DELETE" });
            if (res.ok) {
                setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
            } else {
                console.error("Failed to delete skill");
            }
        } catch (err) {
            console.error("Error deleting skill", err);
        }
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
                    skills.map((skill, index) => (
                        <div key={skill.id} style={skillItemStyle}>
                            {skill.iconUrl && (
                                <img src={skill.iconUrl} alt={skill.name} style={logoStyle} />
                            )}
                            <div style={skillTextGroup}>
                                <span style={skillNameStyle}>
                                    {skill.name}{" "}
                                    <span style={endorsementCountStyle}>
                                        ({skill.endorsementCount || 0} endorsements)
                                    </span>
                                </span>
                            </div>
                            <div style={skillActions}>
                                <button
                                    onClick={() => handleEndorse(skill.id, index)}
                                    style={endorseBtn}
                                    title="Endorse this skill"
                                >
                                    Endorse
                                </button>

                                {skill.showActions && (
                                    <>
                                        <button
                                            onClick={() => handleEdit(skill.id)}
                                            style={iconButton}
                                            title="Edit skill"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(skill.id)}
                                            style={iconButton}
                                            title="Delete skill"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const endorsementCountStyle = {
    fontWeight: "normal",
    fontSize: "0.85rem",
    color: "#555",
};

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

const iconButton = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#007bff",
};

export default SkillsEndorseCard;
