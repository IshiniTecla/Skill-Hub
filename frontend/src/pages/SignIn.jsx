// src/pages/SignIn.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "../components/SocialLogin";

const SignIn = () => {
    const [form, setForm] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: POST request to backend
        console.log("Login Attempt", form);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded bg-white">
            <h2 className="text-2xl font-semibold text-center">Sign In</h2>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <input name="username" type="text" placeholder="Username or Email" required onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full p-2 border rounded" />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign In</button>

                <p className="text-center text-sm">Don't have an account? <Link className="text-blue-600" to="/signup">Sign Up</Link></p>
            </form>

            <SocialLogin />
        </div>
    );
};

export default SignIn;
