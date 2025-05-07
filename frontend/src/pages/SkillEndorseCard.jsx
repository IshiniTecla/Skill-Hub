import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import "../css/SkillEndorseCard.css";

const SkillEndorseCard = () => {
    const [skills, setSkills] = useState([]);
    const [endorsedSkills, setEndorsedSkills] = useState([]);
    const [endorsementMap, setEndorsementMap] = useState({});
    const [popupSkill, setPopupSkill] = useState(null);
    const [endorsementForm, setEndorsementForm] = useState({
        workedTogether: "Yes",
        skillRating: "Good",
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchSkills();
        fetchEndorsements();
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

    const fetchEndorsements = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/user/endorsements", {
                credentials: "include",
            });
            const data = await res.json();
            setEndorsedSkills(data.map((e) => e.skillId));

            const map = {};
            data.forEach((e) => {
                map[e.skillId] = e.id;
            });
            setEndorsementMap(map);
        } catch (err) {
            console.error("Failed to fetch endorsements", err);
        }
    };

    const handleEndorseSubmit = async () => {
        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing
                ? `http://localhost:8080/api/endorsements/${popupSkill.endorsementId}`
                : `http://localhost:8080/api/skills/${popupSkill.id}/endorse`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(endorsementForm),
            });

            if (!res.ok) throw new Error("Failed to save endorsement");

            if (!isEditing) {
                // Increment count for new endorsements only
                setSkills((prev) =>
                    prev.map((s) =>
                        s.id === popupSkill.id
                            ? { ...s, endorsements: (s.endorsements || 0) + 1 }
                            : s
                    )
                );
                setEndorsedSkills((prev) => [...prev, popupSkill.id]);
            }

            setPopupSkill(null);
            if (isEditing && !popupSkill.endorsementId) {
                alert("Missing endorsement ID for editing.");
                return;
            }

        } catch (err) {
            alert("Failed to save endorsement.");
        }
    };

    const handleDeleteEndorsement = async (skillId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/skills/${skillId}/endorse`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to remove endorsement");

            setSkills((prev) =>
                prev.map((s) =>
                    s.id === skillId
                        ? { ...s, endorsements: Math.max(0, (s.endorsements || 1) - 1) }
                        : s
                )
            );
            setEndorsedSkills((prev) => prev.filter((id) => id !== skillId));
        } catch (err) {
            alert("Could not delete the endorsement.");
        }
    };

    return (
        <div className="endorse-card">
            <h2>Skills & Endorsements</h2>
            {skills.length === 0 ? (
                <p className="empty-msg">No skills available to endorse.</p>
            ) : (
                skills.map((skill) => (
                    <div className="skill-item" key={skill.id}>
                        <div className="skill-info">
                            {skill.iconUrl && <img src={skill.iconUrl} alt={skill.name} />}
                            <div>
                                <h4>{skill.name}</h4>
                                <span>
                                    {skill.endorsements || 0} Endorsement
                                    {skill.endorsements !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                        <div className="skill-actions">
                            {endorsedSkills.includes(skill.id) ? (
                                <>
                                    <button
                                        className="btn edit"
                                        onClick={() => {
                                            setPopupSkill({
                                                ...skill,
                                                endorsementId: endorsementMap[skill.id],
                                            });
                                            setEndorsementForm({
                                                workedTogether: "Yes",
                                                skillRating: "Good",
                                            });
                                            setIsEditing(true);
                                        }}
                                    >
                                        <FaEdit style={{ marginRight: "5px" }} />Edit
                                    </button>
                                    <button
                                        className="btn delete"
                                        onClick={() => handleDeleteEndorsement(skill.id)}
                                    >
                                        <FaTrash style={{ marginRight: "5px" }} />Remove
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn endorse"
                                    onClick={() => {
                                        setPopupSkill(skill);
                                        setEndorsementForm({
                                            workedTogether: "Yes",
                                            skillRating: "Good",
                                        });
                                        setIsEditing(false);
                                    }}
                                >
                                    Endorse
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}

            {popupSkill && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>{isEditing ? "Edit" : "Endorse"} {popupSkill.name}</h3>
                        <label>Have you worked together?</label>
                        <select
                            value={endorsementForm.workedTogether}
                            onChange={(e) =>
                                setEndorsementForm({
                                    ...endorsementForm,
                                    workedTogether: e.target.value,
                                })
                            }
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>

                        <label>Rate their skill:</label>
                        <select
                            value={endorsementForm.skillRating}
                            onChange={(e) =>
                                setEndorsementForm({
                                    ...endorsementForm,
                                    skillRating: e.target.value,
                                })
                            }
                        >
                            <option value="Good">Good</option>
                            <option value="Very Good">Very Good</option>
                            <option value="Excellent">Excellent</option>
                        </select>

                        <div className="popup-actions">
                            <button className="btn save" onClick={handleEndorseSubmit}>
                                <FaSave style={{ marginRight: "5px" }} /> Save
                            </button>
                            <button className="btn cancel" onClick={() => setPopupSkill(null)}>
                                <FaTimes style={{ marginRight: "5px" }} /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillEndorseCard;
