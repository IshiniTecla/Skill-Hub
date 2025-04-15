import React, { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "../components/SocialLogin";

const SignIn = () => {
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Login successful");
                console.log("Response:", data);
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Server error");
        }
    };

    const styles = {
        container: {
            maxWidth: "400px",
            margin: "40px auto",
            padding: "30px",
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontFamily: "Arial, sans-serif",
        },
        title: {
            fontSize: "24px",
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "20px",
        },
        input: {
            width: "90%",
            padding: "12px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
        },
        button: {
            width: "20%",
            background: "#2563eb",
            color: "#fff",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            transition: "0.3s",
        },
        linkText: {
            fontSize: "14px",
            textAlign: "center",
            marginTop: "10px",
        },
        link: {
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: "bold",
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" type="text" placeholder="Email" required onChange={handleChange} style={styles.input} />
                <input name="password" type="password" placeholder="Password" required onChange={handleChange} style={styles.input} />
                <button type="submit" style={styles.button}>Sign In</button>
            </form>
            <p style={styles.linkText}>
                Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
            </p>
            <SocialLogin />
        </div>
    );
};

export default SignIn;
