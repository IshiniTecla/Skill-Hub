// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "../components/SocialLogin";

const SignUp = () => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Send POST to backend API
        console.log("Signup Form Submitted", form);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded bg-white">
            <h2 className="text-2xl font-semibold text-center">Create an Account</h2>
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="flex gap-2">
                    <input name="firstName" type="text" placeholder="First Name" required onChange={handleChange} className="w-1/2 p-2 border rounded" />
                    <input name="lastName" type="text" placeholder="Last Name" required onChange={handleChange} className="w-1/2 p-2 border rounded" />
                </div>
                <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="phone" type="tel" placeholder="Phone Number" required onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} className="w-full p-2 border rounded" />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign Up</button>

                <p className="text-center text-sm">Already have an account? <Link className="text-blue-600" to="/signin">Sign In</Link></p>
            </form>

            <SocialLogin />
        </div>
    );
};

export default SignUp;
