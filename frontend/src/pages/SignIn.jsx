import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../components/SocialLogin";

const SignIn = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include", // In case you later send cookies
            });

            // Check if the response is OK and if it returns JSON
            if (res.ok) {
                const data = await res.json();
                alert("Login successful");

                // OPTIONAL: Save user info to localStorage
                localStorage.setItem("user", JSON.stringify(data.user)); // or "data", depending on your backend

                // Redirect to dashboard or skills page
                navigate("/profile");
            } else {
                // If response is not OK, attempt to parse the error response
                const errorData = await res.json();
                alert(errorData.message || "Invalid credentials");
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
