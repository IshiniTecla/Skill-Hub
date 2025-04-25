// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';

function Home() {
    const navigate = useNavigate();

    const handlePostSubmit = () => {
        // After post is created, navigate to the PostFeed page
        navigate("/view");
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Your Post</h1>
            <PostForm onPostSubmit={handlePostSubmit} />
        </div>
    );
}

export default Home;
