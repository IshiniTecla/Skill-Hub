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

            {/* Tab Navigation */}
            <div style={styles.tabWrapper}>
                {["overview", "skills", "posts", "learning"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={activeTab === tab ? styles.activeTab : styles.tab}
                    >
                        {tab === "overview" && "Overview"}
                        {tab === "skills" && "Skills"}
                        {tab === "posts" && "Posts & Feed"}
                        {tab === "learning" && "Learning Plans"}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={styles.sectionWrapper}>
                {activeTab === "overview" && <p style={styles.placeholder}>Welcome to your profile overview.</p>}
                {activeTab === "skills" && <SkillCard />}
                {activeTab === "posts" && <Feed />}
                {activeTab === "learning" && <LearningPlans />}
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
    tabWrapper: {
        display: "flex",
        gap: "1rem",
        padding: "0.5rem 1rem",
        background: "#f0f4f8",
        borderRadius: "12px",
        boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
        marginBottom: "2rem",
        justifyContent: "center",
    },
    tab: {
        padding: "0.6rem 1.2rem",
        border: "none",
        borderRadius: "8px",
        background: "#e0e0e0",
        cursor: "pointer",
        fontSize: "1rem",
        transition: "all 0.3s",
    },
    activeTab: {
        padding: "0.6rem 1.2rem",
        borderRadius: "8px",
        background: "#007bff",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "1rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    sectionWrapper: {
        background: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
    },
    placeholder: {
        textAlign: "center",
        color: "#888",
        fontSize: "1.1rem",
    },
};

export default UserProfile;
