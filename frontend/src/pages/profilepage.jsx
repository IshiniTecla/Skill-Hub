import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Settings, Bookmark, Heart, MessageCircle, PlusSquare, 
  Trash2, Edit, UserX, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import UserModel from '../models/UserModel';
import '../css/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: ''
  });
  
  const { username } = useParams();
  const navigate = useNavigate();
  
  // Get current user from local storage
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    fetchProfileData();
  }, [username]);
  
  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      let response;
      
      // If no username is provided, fetch current user's profile
      if (!username) {
        response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsOwnProfile(true);
      } else {
        response = await axios.get(`/api/users/username/${username}`);
        setIsOwnProfile(currentUser && currentUser.username === username);
      }
      
      const userData = new UserModel(response.data);
      setProfile(userData);
      setEditForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        email: userData.email || '',
        bio: userData.bio || ''
      });
      
      // Fetch posts
      if (response.data.id) {
        fetchUserPosts(response.data.id);
        fetchSavedPosts(response.data.id);
        fetchFollowers(response.data.id);
        fetchFollowing(response.data.id);
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchUserPosts = async (userId) => {
    try {
      const response = await axios.get(`/api/posts/user/${userId}`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };
  
  const fetchSavedPosts = async (userId) => {
    if (!isOwnProfile) return;
    
    try {
      const response = await axios.get('/api/posts/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedPosts(response.data);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
    }
  };
  
  const fetchFollowers = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}/followers`);
      setFollowers(response.data);
    } catch (err) {
      console.error('Error fetching followers:', err);
    }
  };
  
  const fetchFollowing = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}/following`);
      setFollowing(response.data);
    } catch (err) {
      console.error('Error fetching following:', err);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      uploadProfileImage(file);
    }
  };
  
  const uploadProfileImage = async (file) => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(
        `/api/users/${currentUser.id}/upload-profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const updatedUser = new UserModel(response.data);
      setProfile(updatedUser);
      setImageFile(null);
      
      // Update the user in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Profile image updated successfully');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to update profile image');
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(
        `/api/users/${currentUser.id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const updatedUser = new UserModel(response.data);
      setProfile(updatedUser);
      setIsEditModalOpen(false);
      
      // Update the user in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Profile updated successfully');
      
      // Update URL if username changed
      if (editForm.username !== currentUser.username) {
        navigate(`/profile/${editForm.username}`);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      await axios.post(
        `/api/users/${currentUser.id}/follow/${profile.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update followers list
      const updatedProfile = {...profile};
      updatedProfile.followers = [...updatedProfile.followers, currentUser.id];
      setProfile(updatedProfile);
      
      // Refresh followers list
      fetchFollowers(profile.id);
      toast.success(`You are now following ${profile.username}`);
    } catch (err) {
      console.error('Error following user:', err);
      toast.error('Failed to follow user');
    }
  };
  
  const handleUnfollow = async () => {
    try {
      await axios.post(
        `/api/users/${currentUser.id}/unfollow/${profile.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update followers list
      const updatedProfile = {...profile};
      updatedProfile.followers = updatedProfile.followers.filter(id => id !== currentUser.id);
      setProfile(updatedProfile);
      
      // Refresh followers list
      fetchFollowers(profile.id);
      toast.info(`You unfollowed ${profile.username}`);
    } catch (err) {
      console.error('Error unfollowing user:', err);
      toast.error('Failed to unfollow user');
    }
  };
  
  const handleRemoveFollower = async (followerId) => {
    try {
      await axios.post(
        `/api/users/${profile.id}/remove-follower/${followerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update followers list
      setFollowers(prev => prev.filter(user => user.id !== followerId));
      
      // Update profile
      const updatedProfile = {...profile};
      updatedProfile.followers = updatedProfile.followers.filter(id => id !== followerId);
      setProfile(updatedProfile);
      
      toast.info('Follower removed');
    } catch (err) {
      console.error('Error removing follower:', err);
      toast.error('Failed to remove follower');
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/users/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear local storage and redirect to login
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.info('Your account has been deleted');
      navigate('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
      toast.error('Failed to delete account');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update posts list
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post deleted');
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Failed to delete post');
    }
  };
  
  const handleSavePost = async (postId) => {
    try {
      await axios.post(
        `/api/posts/${postId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Post saved');
      fetchSavedPosts(currentUser.id);
    } catch (err) {
      console.error('Error saving post:', err);
      toast.error('Failed to save post');
    }
  };
  
  const handleUnsavePost = async (postId) => {
    try {
      await axios.post(
        `/api/posts/${postId}/unsave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.info('Post removed from saved items');
      setSavedPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error unsaving post:', err);
      toast.error('Failed to remove post from saved items');
    }
  };
  
  if (isLoading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!profile) {
    return <div className="error-message">Profile not found</div>;
  }
  
  const isFollowing = currentUser && profile.followers && profile.followers.includes(currentUser.id);
  
  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        {/* Profile Image */}
        <div className="profile-image-container">
          <div className="profile-image">
            {profile.profileImage ? (
              <img 
                src={`/api/users/${profile.id}/profile-image`} 
                alt={`${profile.username}'s profile`} 
              />
            ) : (
              <div className="profile-initials">
                {profile.initials}
              </div>
            )}
          </div>
          
          {isOwnProfile && (
            <label htmlFor="profile-image-upload" className="profile-image-edit">
              <div className="edit-overlay">
                <span>Change Photo</span>
              </div>
              <input 
                id="profile-image-upload" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="profile-info">
          <div className="profile-username-container">
            <h1 className="profile-username">{profile.username}</h1>
            
            {isOwnProfile ? (
              <div className="profile-actions">
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                </button>
                <button className="settings-btn">
                  <Settings size={20} />
                </button>
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="profile-actions">
                {currentUser ? (
                  isFollowing ? (
                    <button 
                      className="following-btn"
                      onClick={handleUnfollow}
                    >
                      Following
                    </button>
                  ) : (
                    <button 
                      className="follow-btn"
                      onClick={handleFollow}
                    >
                      Follow
                    </button>
                  )
                ) : (
                  <button 
                    className="follow-btn"
                    onClick={() => navigate('/login')}
                  >
                    Follow
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">posts</span>
            </div>
            <div 
              className="stat-item clickable"
              onClick={() => setIsFollowersModalOpen(true)}
            >
              <span className="stat-number">{profile.followersCount}</span>
              <span className="stat-label">followers</span>
            </div>
            <div 
              className="stat-item clickable"
              onClick={() => setIsFollowingModalOpen(true)}
            >
              <span className="stat-number">{profile.followingCount}</span>
              <span className="stat-label">following</span>
            </div>
          </div>
          
          <div className="profile-details">
            <h2 className="profile-name">{profile.fullName}</h2>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-bio">{profile.bio || 'No bio yet.'}</p>
          </div>
        </div>
      </div>
      
      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <Grid size={12} />
          <span>POSTS</span>
        </button>
        {isOwnProfile && (
          <button 
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={12} />
            <span>SAVED</span>
          </button>
        )}
      </div>
      
      {/* Posts Grid */}
      <div className="posts-grid">
        {activeTab === 'posts' ? (
          posts.length > 0 ? (
            posts.map(post => (
              <div className="post-item" key={post.id}>
                <img src={post.imageUrl || `/api/posts/${post.id}/image`} alt="Post" />
                <div className="post-overlay">
                  <div className="post-stats">
                    <div className="post-stat">
                      <Heart size={16} fill="white" color="white" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="post-stat">
                      <MessageCircle size={16} fill="white" color="white" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                  
                  {isOwnProfile && (
                    <div className="post-actions">
                      <button 
                        className="post-action-btn delete"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-posts">
              <div className="no-posts-icon">
                <PlusSquare size={48} />
              </div>
              <h3>No Posts Yet</h3>
              {isOwnProfile && (
                <p>Share photos to showcase your skills and achievements.</p>
              )}
            </div>
          )
        ) : (
          savedPosts.length > 0 ? (
            savedPosts.map(post => (
              <div className="post-item" key={post.id}>
                <img src={post.imageUrl || `/api/posts/${post.id}/image`} alt="Post" />
                <div className="post-overlay">
                  <div className="post-stats">
                    <div className="post-stat">
                      <Heart size={16} fill="white" color="white" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="post-stat">
                      <MessageCircle size={16} fill="white" color="white" />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                  
                  <div className="post-actions">
                    <button 
                      className="post-action-btn unsave"
                      onClick={() => handleUnsavePost(post.id)}
                    >
                      <Bookmark size={16} fill="white" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-posts">
              <div className="no-posts-icon">
                <Bookmark size={48} />
              </div>
              <h3>No Saved Posts</h3>
              <p>Save posts to view them later.</p>
            </div>
          )
        )}
      </div>
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button 
                className="close-btn"
                onClick={() => setIsEditModalOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  disabled
                  className="disabled-input"
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  rows="4"
                  maxLength="150"
                ></textarea>
                <small>{editForm.bio?.length || 0}/150</small>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button"
                  className="danger-btn"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete Account
                </button>
                
                <div>
                  <button 
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="save-btn"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h2>Delete Account</h2>
              <button 
                className="close-btn"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-content">
              <p className="warning-text">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <p>All your posts, comments, and account data will be permanently removed.</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-btn"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Followers Modal */}
      {isFollowersModalOpen && (
        <div className="modal-overlay">
          <div className="users-modal">
            <div className="modal-header">
              <h2>Followers</h2>
              <button 
                className="close-btn"
                onClick={() => setIsFollowersModalOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="users-list">
              {followers.length > 0 ? (
                followers.map(follower => (
                  <div className="user-item" key={follower.id}>
                    <div className="user-avatar" onClick={() => {
                      setIsFollowersModalOpen(false);
                      navigate(`/profile/${follower.username}`);
                    }}>
                      {follower.profileImage ? (
                        <img 
                          src={`/api/users/${follower.id}/profile-image`} 
                          alt={`${follower.username}'s profile`} 
                        />
                      ) : (
                        <div className="user-initials">
                          {((follower.firstName ? follower.firstName[0] : '') + 
                            (follower.lastName ? follower.lastName[0] : '')).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="user-info" onClick={() => {
                      setIsFollowersModalOpen(false);
                      navigate(`/profile/${follower.username}`);
                    }}>
                      <div className="user-username">{follower.username}</div>
                      <div className="user-name">{follower.firstName} {follower.lastName}</div>
                    </div>
                    
                    {isOwnProfile && (
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveFollower(follower.id)}
                      >
                        <UserX size={16} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-list">No followers yet</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Following Modal */}
      {isFollowingModalOpen && (
        <div className="modal-overlay">
          <div className="users-modal">
            <div className="modal-header">
              <h2>Following</h2>
              <button 
                className="close-btn"
                onClick={() => setIsFollowingModalOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="users-list">
              {following.length > 0 ? (
                following.map(user => (
                  <div className="user-item" key={user.id}>
                    <div className="user-avatar" onClick={() => {
                      setIsFollowingModalOpen(false);
                      navigate(`/profile/${user.username}`);
                    }}>
                      {user.profileImage ? (
                        <img 
                          src={`/api/users/${user.id}/profile-image`} 
                          alt={`${user.username}'s profile`} 
                        />
                      ) : (
                        <div className="user-initials">
                          {((user.firstName ? user.firstName[0] : '') + 
                            (user.lastName ? user.lastName[0] : '')).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="user-info" onClick={() => {
                      setIsFollowingModalOpen(false);
                      navigate(`/profile/${user.username}`);
                    }}>
                      <div className="user-username">{user.username}</div>
                      <div className="user-name">{user.firstName} {user.lastName}</div>
                    </div>
                    
                    {isOwnProfile && (
                      <button 
                        className="unfollow-btn"
                        onClick={() => {
                          handleUnfollow(user.id);
                          setFollowing(prev => prev.filter(f => f.id !== user.id));
                        }}
                      >
                        Unfollow
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-list">Not following anyone yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;