import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // add useNavigate
import SocialLogin from "../components/SocialLogin";

const SignUp = () => {
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: ""
    });
    const navigate = useNavigate(); // <-- add this

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                alert("User registered successfully");
                console.log("Response:", data);
                navigate("/signin"); // ✅ redirect after signup success
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Server error");
        }
    };

    const styles = {
        container: {
            maxWidth: "500px",
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
        row: {
            display: "flex",
            gap: "10px",
        },
        input: {
            flex: 1,
            padding: "12px",
            marginTop: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
        },
        fullInput: {
            width: "90%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
        },
        button: {
            width: "100%", // updated from 20% to 100%
            background: "#2563eb",
            color: "#fff",
            padding: "12px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            marginTop: "15px",
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
            <h2 style={styles.title}>Create an Account</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.row}>
                    <input name="firstName" type="text" placeholder="First Name" required onChange={handleChange} style={styles.input} />
                    <input name="lastName" type="text" placeholder="Last Name" required onChange={handleChange} style={styles.input} />
                </div>
                <input name="email" type="email" placeholder="Email" required onChange={handleChange} style={styles.fullInput} />
                <input name="phone" type="tel" placeholder="Phone Number" required onChange={handleChange} style={styles.fullInput} />
                <input name="password" type="password" placeholder="Password" required onChange={handleChange} style={styles.fullInput} />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} style={styles.fullInput} />
                <button type="submit" style={styles.button}>Sign Up</button>
            </form>
            <p style={styles.linkText}>
                Already have an account? <Link to="/signin" style={styles.link}>Sign In</Link>
            </p>
            <SocialLogin />
        </div>
    );
};

export default SignUp;
