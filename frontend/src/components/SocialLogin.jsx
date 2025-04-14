import React from "react";

const SocialLogin = () => {
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const handleGitHubLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/github";
    };

    const buttonStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        fontWeight: "500",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        border: "none"
    };

    const googleStyle = {
        ...buttonStyle,
        backgroundColor: "#DB4437",
        color: "#fff"
    };

    const githubStyle = {
        ...buttonStyle,
        backgroundColor: "#24292e",
        color: "#fff"
    };

    const iconStyle = {
        width: "20px",
        height: "20px"
    };

    return (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <button style={googleStyle} onClick={handleGoogleLogin}>
                <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                    alt="Google"
                    style={iconStyle}
                />
                Continue with Google
            </button>

            <button style={githubStyle} onClick={handleGitHubLogin}>
                <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                    alt="GitHub"
                    style={iconStyle}
                />
                Continue with GitHub
            </button>
        </div>
    );
};

export default SocialLogin;
