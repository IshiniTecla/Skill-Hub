import React, { useEffect, useState } from "react";
import SkillForm from "./SkillForm";
import SkillItem from "./SkillItem";

const SkillList = () => {
    const [skills, setSkills] = useState([]);

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

    const handleAddSkill = (newSkill) => {
        setSkills([newSkill, ...skills]);
    };

    const handleEndorse = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/api/skills/${id}/endorse`, {
                method: "POST",
            });
            const updatedSkill = await res.json();
            setSkills(skills.map((s) => (s.id === id ? updatedSkill : s)));
        } catch (err) {
            alert("Failed to endorse skill");
        }
    };

    const handleEdit = async (skill) => {
        const name = prompt("Edit skill name", skill.name);
        if (name) {
            try {
                const res = await fetch(`http://localhost:8080/api/skills/${skill.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name }),
                });
                const updated = await res.json();
                setSkills(skills.map((s) => (s.id === skill.id ? updated : s)));
            } catch (err) {
                alert("Failed to update skill");
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/skills/${id}`, {
                method: "DELETE",
            });
            setSkills(skills.filter((s) => s.id !== id));
        } catch (err) {
            alert("Failed to delete skill");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
            <h2 style={{ textAlign: "center" }}>Skills & Endorsements</h2>
            <SkillForm onAddSkill={handleAddSkill} />
            {skills.map((skill) => (
                <SkillItem
                    key={skill.id}
                    skill={skill}
                    onEndorse={handleEndorse}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
};

export default SkillList;
