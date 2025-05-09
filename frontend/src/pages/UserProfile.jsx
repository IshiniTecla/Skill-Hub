import React, { useState } from "react";
import SkillCard from "./SkillCard";

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState("overview");

    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "John Doe",
        email: "john@example.com",
        bio: "Full Stack Developer | React & Spring Boot Enthusiast",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
    };

    return (
        <div style={styles.container}>
            {/* Profile Header */}
            <div style={styles.profileHeader}>
                <img src={user.avatarUrl} alt="Avatar" style={styles.avatar} />
                <div>
                    <h2 style={styles.name}>{user.name}</h2>
                    <p style={styles.email}>{user.email}</p>
                    <p style={styles.bio}>{user.bio}</p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div style={styles.nav}>
                <button
                    style={activeTab === "overview" ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </button>
                <button
                    style={activeTab === "skills" ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab("skills")}
                >
                    Skills
                </button>
                <button
                    style={activeTab === "projects" ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab("projects")}
                >
                    Projects
                </button>
                {/* Add more tabs as needed */}
            </div>

            {/* Tab Content */}
            <div style={styles.tabContent}>
                {activeTab === "overview" && <p style={styles.placeholder}>Welcome to your profile overview.</p>}
                {activeTab === "skills" && <SkillCard />}
                {activeTab === "projects" && <p style={styles.placeholder}>Your projects will be displayed here.</p>}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1000px",
        margin: "2rem auto",
        padding: "1rem",
        fontFamily: "'Segoe UI', sans-serif",
    },
    profileHeader: {
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        background: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
        marginBottom: "2rem",
    },
    avatar: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #eee",
    },
    name: {
        fontSize: "1.8rem",
        margin: "0",
    },
    email: {
        fontSize: "1rem",
        color: "#777",
        margin: "0.2rem 0",
    },
    bio: {
        fontSize: "1rem",
        color: "#444",
    },
    nav: {
        display: "flex",
        gap: "1rem",
        marginBottom: "1.5rem",
    },
    tab: {
        padding: "0.5rem 1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#f9f9f9",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "all 0.3s ease",
    },
    activeTab: {
        padding: "0.5rem 1rem",
        border: "1px solid #007bff",
        borderRadius: "8px",
        background: "#007bff",
        color: "#fff",
        cursor: "pointer",
        fontSize: "1rem",
    },
    tabContent: {
        minHeight: "200px",
    },
    placeholder: {
        textAlign: "center",
        color: "#888",
        fontSize: "1.1rem",
    },
};

export default UserProfile;
