// src/pages/EditEndorsementCard.jsx
import React from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import "../css/SkillEndorseCard.css"; // reuse existing CSS

const EditEndorsementCard = ({ skill, formData, onChange, onSave, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h3>Edit {skill.name}</h3>

                <label>Have you worked together?</label>
                <select
                    value={formData.workedTogether}
                    onChange={(e) => onChange({ ...formData, workedTogether: e.target.value })}
                >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>

                <label>Rate their skill:</label>
                <select
                    value={formData.skillRating}
                    onChange={(e) => onChange({ ...formData, skillRating: e.target.value })}
                >
                    <option value="Good">Good</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Excellent">Excellent</option>
                </select>

                <div className="popup-actions">
                    <button className="btn save" onClick={onSave}>
                        <FaSave style={{ marginRight: "5px" }} /> Save
                    </button>
                    <button className="btn cancel" onClick={onClose}>
                        <FaTimes style={{ marginRight: "5px" }} /> Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditEndorsementCard;
