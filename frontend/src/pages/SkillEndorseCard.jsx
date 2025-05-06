import React, { useEffect, useState } from "react";
import "../css/SkillEndorseCard.css";


const SkillEndorseCard = () => {
    const [skills, setSkills] = useState([]);
    const [endorsedSkills, setEndorsedSkills] = useState([]);
    const [popupSkill, setPopupSkill] = useState(null);
    const [endorsementForm, setEndorsementForm] = useState({
        workedTogether: "Yes",
        skillRating: "Good",
    });

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
        } catch (err) {
            console.error("Failed to fetch endorsements", err);
        }
    };

    const handleEndorseSubmit = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/skills/${popupSkill.id}/endorse`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(endorsementForm),
            });

            if (!res.ok) throw new Error("Endorsement failed");

            setSkills((prev) =>
                prev.map((s) =>
                    s.id === popupSkill.id ? { ...s, endorsements: (s.endorsements || 0) + 1 } : s
                )
            );
            setEndorsedSkills((prev) => [...prev, popupSkill.id]);
            setPopupSkill(null);
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
                    s.id === skillId ? { ...s, endorsements: Math.max(0, (s.endorsements || 1) - 1) } : s
                )
            );

            setEndorsedSkills((prev) => prev.filter((id) => id !== skillId));
        } catch (err) {
            alert("Could not delete the endorsement.");
        }
    };

    return (
        <div className="endorse-card">
            <h2>Endorse Skills</h2>
            {skills.length === 0 ? (
                <p className="empty-msg">No skills available to endorse.</p>
            ) : (
                skills.map((skill) => (
                    <div className="skill-item" key={skill.id}>
                        <div className="skill-info">
                            {skill.iconUrl && <img src={skill.iconUrl} alt={skill.name} />}
                            <div>
                                <h4>{skill.name}</h4>
                                <span>{skill.endorsements || 0} Endorsement{skill.endorsements !== 1 ? "s" : ""}</span>
                            </div>
                        </div>
                        <div className="skill-actions">
                            {endorsedSkills.includes(skill.id) ? (
                                <>
                                    <button className="btn edit" onClick={() => {
                                        setPopupSkill(skill);
                                        setEndorsementForm({ workedTogether: "Yes", skillRating: "Good" });
                                    }}>Edit</button>
                                    <button className="btn delete" onClick={() => handleDeleteEndorsement(skill.id)}>Remove</button>
                                </>
                            ) : (
                                <button className="btn endorse" onClick={() => {
                                    setPopupSkill(skill);
                                    setEndorsementForm({ workedTogether: "Yes", skillRating: "Good" });
                                }}>Endorse</button>
                            )}
                        </div>
                    </div>
                ))
            )}

            {popupSkill && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>Endorse {popupSkill.name}</h3>
                        <label>Have you worked together?</label>
                        <select
                            value={endorsementForm.workedTogether}
                            onChange={(e) => setEndorsementForm({ ...endorsementForm, workedTogether: e.target.value })}
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label>Rate their skill:</label>
                        <select
                            value={endorsementForm.skillRating}
                            onChange={(e) => setEndorsementForm({ ...endorsementForm, skillRating: e.target.value })}
                        >
                            <option value="Good">Good</option>
                            <option value="Very Good">Very Good</option>
                            <option value="Excellent">Excellent</option>
                        </select>
                        <div className="popup-actions">
                            <button className="btn save" onClick={handleEndorseSubmit}>Save</button>
                            <button className="btn cancel" onClick={() => setPopupSkill(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillEndorseCard;
