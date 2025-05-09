import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Adding icons for visual appeal

const Home = () => {
    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <div style={styles.content}>
                <h1 style={styles.heading}>Welcome to SkillHub</h1>
                <p style={styles.subheading}>Learn, Share, and Grow with Others</p>

                <div style={styles.description}>
                    <p style={styles.infoText}>Join a community of learners and experts. Gain new skills, connect with peers, and start your learning journey today!</p>
                </div>

                <div style={styles.buttonsContainer}>
                    <Link to="/signin" style={styles.link}>
                        <button style={styles.button}>
                            <FaSignInAlt style={styles.icon} /> Sign In
                        </button>
                    </Link>

                    <Link to="/signup" style={styles.link}>
                        <button style={styles.button}>
                            <FaUserPlus style={styles.icon} /> Sign Up
                        </button>
                    </Link>
                </div>

                <div style={styles.exploreSection}>
                    <p style={styles.exploreText}>Explore our platform and start learning today!</p>
                    <Link to="/explore" style={styles.link}>
                        <button style={styles.exploreButton}>Explore Now</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
        backgroundImage: 'url("https://your-image-url-here.jpg")', // Add a background image URL here
        backgroundSize: 'cover', // Cover the entire container
        backgroundPosition: 'center center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)', // Darker overlay to make text stand out
        zIndex: 0,
    },
    content: {
        textAlign: 'center',
        padding: '30px',
        backgroundColor: 'rgba(41, 34, 34, 0.8)', // Semi-transparent background
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        maxWidth: '600px',
        zIndex: 1,
    },
    heading: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#fff', // White text for contrast
        marginBottom: '10px',
    },
    subheading: {
        fontSize: '1.2rem',
        color: '#fff', // White text for contrast
        marginBottom: '20px',
        fontWeight: '500',
    },
    description: {
        marginBottom: '30px',
    },
    infoText: {
        fontSize: '1rem',
        color: '#ddd', // Light grey text
        maxWidth: '500px',
        margin: '0 auto',
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '20px',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px 30px',
        fontSize: '1rem',
        borderRadius: '5px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    icon: {
        marginRight: '8px',
    },
    link: {
        textDecoration: 'none',
    },
    exploreSection: {
        marginTop: '20px',
    },
    exploreText: {
        fontSize: '1.1rem',
        color: '#fff',
        fontWeight: '600',
    },
    exploreButton: {
        padding: '15px 25px',
        fontSize: '1rem',
        borderRadius: '5px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default Home;
