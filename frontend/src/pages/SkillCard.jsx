import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const SkillCard = () => {
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

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won’t be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await fetch(`/api/skills/${id}`, {
                    method: "DELETE",
                });
                fetchSkills(); // Refresh the list
                Swal.fire("Deleted!", "The skill has been deleted.", "success");
            } catch (err) {
                Swal.fire("Error!", "Failed to delete skill.", "error");
            }
        }
    };

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <h3 style={titleStyle}>Skills</h3>
                <div style={iconGroup}>
                    <button onClick={() => navigate("/skills/add")} style={iconBtnStyle} title="Add Skill"><FaPlus /></button>

                </div>
            </div>

            <div>
                {skills.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#999" }}>No skills added yet.</p>
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
                                    onClick={() => navigate(`/skills/edit/${skill.id}`)}
                                    style={smallBtn}
                                    title="Edit Skill"
                                ><FaEdit /></button>

                                <button
                                    onClick={() => handleDelete(skill.id)}
                                    style={smallBtn}
                                    title="Delete Skill"
                                >
                                    <FaTrash />
                                </button>


                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
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

const iconGroup = {
    display: "flex",
    gap: "0.5rem",
};

const iconBtnStyle = {
    background: "#f0f2f5",
    border: "none",
    borderRadius: "6px",
    fontSize: "1.2rem",
    padding: "0.4rem 0.7rem",
    cursor: "pointer",
    transition: "background 0.3s",
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

const smallBtn = {
    background: "none",
    border: "none",
    fontSize: "1.1rem",
    cursor: "pointer",
    padding: "0.2rem",
    color: "#555",
};


export default SkillCard;