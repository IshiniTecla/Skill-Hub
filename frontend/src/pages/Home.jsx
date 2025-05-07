import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';

function Home() {
    const navigate = useNavigate();

    const handlePostSubmit = () => {
        navigate("/view");
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Your Post</h1>
            <PostForm onPostSubmit={handlePostSubmit} />
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                
            </div>
        </div>
    );
}

export default Home;
