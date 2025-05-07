import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../css/SkillEndorseCard.css";
import EditEndorsementCard from "./EditEndorsementCard";

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

            const map = {};
            data.forEach((e) => {
                map[e.skillId] = {
                    id: e.id,
                    workedTogether: e.workedTogether,
                    skillRating: e.skillRating,
                };
            });

            setEndorsedSkills(data.map((e) => e.skillId));
            setEndorsementMap(map);
        } catch (err) {
            console.error("Failed to fetch endorsements", err);
        }
    };

    const handleEndorseClick = (skill) => {
        // Check if the skill already has an endorsement.
        if (endorsedSkills.includes(skill.id)) {
            handleEditClick(skill);  // If endorsed, show the edit popup
        } else {
            setPopupSkill(skill);  // If not endorsed, show the add popup
            setEndorsementForm({
                workedTogether: "Yes",
                skillRating: "Good",
            });
            setIsEditing(false); // For adding a new endorsement
        }
    };

    const handleEditClick = (skill) => {
        const saved = endorsementMap[skill.id];
        if (!saved) {
            console.warn("No saved endorsement found for this skill. Default values will be used.");
            setPopupSkill(skill);
            setEndorsementForm({
                workedTogether: "Yes",
                skillRating: "Good",
            });
        } else {
            setPopupSkill({ ...skill, endorsementId: saved.id });
            setEndorsementForm({
                workedTogether: saved.workedTogether,
                skillRating: saved.skillRating,
            });
        }
        setIsEditing(true);  // Set editing mode
    };

    const handleSave = async () => {
        try {
            if (isEditing && popupSkill?.endorsementId) {
                await updateEndorsement(popupSkill.endorsementId);
            } else if (popupSkill?.id) {
                await createEndorsement(popupSkill.id);
            } else {
                throw new Error("Invalid skill or endorsement ID.");
            }

            setPopupSkill(null); // Close popup on success
        } catch (err) {
            alert("Failed to save endorsement.");
            console.error("Save error:", err);
        }
    };

    const updateEndorsement = async (id, updatedData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/endorsements/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Updated endorsement:", data);
            } else {
                console.error("Failed to update endorsement");
            }
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    const createEndorsement = async (skillId) => {
        const res = await fetch(`http://localhost:8080/api/skills/${skillId}/endorse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(endorsementForm),
        });

        if (!res.ok) {
            throw new Error(`Failed to create endorsement: ${res.status}`);
        }

        const data = await res.json();
        console.log("Created endorsement:", data);

        setEndorsementMap((prev) => ({
            ...prev,
            [skillId]: {
                id: data.id,
                workedTogether: data.workedTogether,
                skillRating: data.skillRating,
            },
        }));
        setEndorsedSkills((prev) => [...prev, skillId]);
        setSkills((prev) =>
            prev.map((s) =>
                s.id === skillId ? { ...s, endorsements: (s.endorsements || 0) + 1 } : s
            )
        );
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
                                    <button className="btn edit" onClick={() => handleEditClick(skill)}>
                                        <FaEdit style={{ marginRight: "5px" }} />Edit
                                    </button>
                                    <button className="btn delete" onClick={() => handleDeleteEndorsement(skill.id)}>
                                        <FaTrash style={{ marginRight: "5px" }} />Remove
                                    </button>
                                </>
                            ) : (
                                <button className="btn endorse" onClick={() => handleEndorseClick(skill)}>
                                    Endorse
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
            {popupSkill && (
                <EditEndorsementCard
                    skill={popupSkill}
                    formData={endorsementForm}
                    onChange={setEndorsementForm}
                    onSave={handleSave}
                    onClose={() => setPopupSkill(null)}
                />
            )}
        </div>
    );
};

export default SkillEndorseCard;
