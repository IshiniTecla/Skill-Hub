// src/components/SocialLogin.jsx
import React from "react";

const SocialLogin = () => {
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="space-y-2 mt-4">
            <button
                onClick={handleGoogleLogin}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
                Continue with Google
            </button>
        </div>
    );
};

export default SocialLogin;
