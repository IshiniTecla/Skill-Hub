// src/pages/CreatePost.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { getToken } from '../utils/auth';
import { Image, X, Upload, MapPin, UserPlus, Smile } from 'lucide-react';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim() && !imageFile) {
            setError('Please add some text or an image to your post');
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            // Create FormData for multipart/form-data (for image upload)
            const formData = new FormData();
            formData.append('content', content);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            // Send to backend API
            await axios.post('/posts/create', formData, {
                headers: { 
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Redirect to feed on success
            navigate('/feed');
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h1 className="text-xl font-medium">Create Post</h1>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-4">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        
                        <div className="flex items-start space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
                                {currentUser?.profilePicture ? (
                                    <img 
                                        src={currentUser.profilePicture} 
                                        alt={`${currentUser.username}'s profile`}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                                        {currentUser?.firstName?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <div className="font-medium text-sm">
                                    {currentUser?.firstName} {currentUser?.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                    @{currentUser?.username}
                                </div>
                            </div>
                        </div>
                        
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border-0 focus:ring-0 text-lg resize-none min-h-[120px]"
                        />
                        
                        {imagePreview && (
                            <div className="relative mt-3 rounded-lg overflow-hidden">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="max-h-96 w-full object-contain bg-black"
                                />
                                <button 
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white p-1 rounded-full hover:bg-opacity-100"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border-t border-gray-200">
                        <div className="flex space-x-4">
                            <label className="cursor-pointer flex items-center text-gray-700 hover:text-gray-900">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageChange}
                                />
                                <Image size={22} className="mr-1" />
                                <span className="text-sm">Photo</span>
                            </label>
                            
                            <button 
                                type="button" 
                                className="flex items-center text-gray-700 hover:text-gray-900"
                            >
                                <MapPin size={22} className="mr-1" />
                                <span className="text-sm">Location</span>
                            </button>
                            
                            <button 
                                type="button" 
                                className="flex items-center text-gray-700 hover:text-gray-900"
                            >
                                <UserPlus size={22} className="mr-1" />
                                <span className="text-sm">Tag</span>
                            </button>
                            
                            <button 
                                type="button" 
                                className="flex items-center text-gray-700 hover:text-gray-900"
                            >
                                <Smile size={22} className="mr-1" />
                                <span className="text-sm">Feeling</span>
                            </button>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting || (!content.trim() && !imageFile)}
                            className={`px-4 py-2 rounded-md font-medium ${
                                content.trim() || imageFile
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-indigo-300 text-white cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;