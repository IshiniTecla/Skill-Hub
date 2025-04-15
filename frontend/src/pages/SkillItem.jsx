import React from "react";

const SkillItem = ({ skill, onEndorse, onEdit, onDelete }) => {
    return (
        <div style={itemStyle}>
            <h4>{skill.name}</h4>
            <p>Endorsements: {skill.endorsementCount}</p>
            <div style={buttonGroup}>
                <button onClick={() => onEndorse(skill.id)} style={endorseBtn}>Endorse</button>
                <button onClick={() => onEdit(skill)} style={editBtn}>Edit</button>
                <button onClick={() => onDelete(skill.id)} style={deleteBtn}>Delete</button>
            </div>
        </div>
    );
};

const itemStyle = {
    background: "#f9f9f9",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const buttonGroup = { display: "flex", gap: "0.5rem", marginTop: "0.5rem" };

const endorseBtn = { background: "#28a745", color: "#fff", border: "none", padding: "0.4rem 1rem", borderRadius: "4px" };
const editBtn = { background: "#ffc107", border: "none", padding: "0.4rem 1rem", borderRadius: "4px" };
const deleteBtn = { background: "#dc3545", color: "#fff", border: "none", padding: "0.4rem 1rem", borderRadius: "4px" };

export default SkillItem;
