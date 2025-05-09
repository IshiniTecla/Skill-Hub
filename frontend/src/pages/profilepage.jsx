import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Settings, Bookmark, Heart, MessageCircle, PlusSquare, 
  Trash2, Edit, UserX, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import UserModel from '../models/UserModel';
// Import the custom API modules
import { userApi, postApi } from '../api/axios';
import "../css/Profile.css";

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
  
  useEffect(() => {
    fetchProfileData();
  }, [username]);
  
  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      let userData;
      
      // If no username is provided, fetch current user's profile
      if (!username) {
        const response = await userApi.getCurrentProfile();
        userData = new UserModel(response.data);
        setIsOwnProfile(true);
      } else {
        const response = await userApi.getUserByUsername(username);
        userData = new UserModel(response.data);
        setIsOwnProfile(currentUser && currentUser.username === username);
      }
      
      setProfile(userData);
      setEditForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        email: userData.email || '',
        bio: userData.bio || ''
      });
      
      // Fetch additional data - wrapped in try/catch to handle errors
      if (userData.id) {
        try {
          await fetchUserPosts(userData.id);
        } catch (err) {
          console.warn('Could not fetch posts:', err);
          setPosts([]);
        }
        
        if (isOwnProfile && currentUser) {
          try {
            await fetchSavedPosts();
          } catch (err) {
            console.warn('Could not fetch saved posts:', err);
            setSavedPosts([]);
          }
        }
        
        try {
          await fetchFollowers(userData.id);
        } catch (err) {
          console.warn('Could not fetch followers:', err);
          setFollowers([]);
        }
        
        try {
          await fetchFollowing(userData.id);
        } catch (err) {
          console.warn('Could not fetch following:', err);
          setFollowing([]);
        }
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
      const response = await postApi.getUserPosts(userId);
      // Check if response.data exists and is an array before setting state
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      // Set empty array on error to prevent UI issues
      setPosts([]);
      throw err; // Re-throw to be caught by caller
    }
  };
  
  const fetchSavedPosts = async () => {
    if (!isOwnProfile || !currentUser) return;
    
    try {
      const response = await postApi.getSavedPosts();
      setSavedPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setSavedPosts([]);
      throw err; // Re-throw to be caught by caller
    }
  };
  
  const fetchFollowers = async (userId) => {
    try {
      const response = await userApi.getFollowers(userId);
      setFollowers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching followers:', err);
      setFollowers([]);
      throw err; // Re-throw to be caught by caller
    }
  };
  
  const fetchFollowing = async (userId) => {
    try {
      const response = await userApi.getFollowing(userId);
      setFollowing(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching following:', err);
      setFollowing([]);
      throw err; // Re-throw to be caught by caller
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
    if (!file || !currentUser) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await userApi.uploadProfileImage(currentUser.id, formData);
      
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
    if (!currentUser) return;
    
    try {
      const response = await userApi.updateUser(currentUser.id, editForm);
      
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
    
    if (!profile) return;
    
    try {
      await userApi.followUser(currentUser.id, profile.id);
      
      // Update followers list
      const updatedProfile = {...profile};
      updatedProfile.followers = [...(updatedProfile.followers || []), currentUser.id];
      updatedProfile.followersCount = (updatedProfile.followersCount || 0) + 1;
      setProfile(updatedProfile);
      
      // Refresh followers list
      fetchFollowers(profile.id).catch(err => console.warn("Failed to refresh followers:", err));
      toast.success(`You are now following ${profile.username}`);
    } catch (err) {
      console.error('Error following user:', err);
      toast.error('Failed to follow user');
    }
  };
  
  const handleUnfollow = async () => {
    if (!currentUser || !profile) return;
    
    try {
      await userApi.unfollowUser(currentUser.id, profile.id);
      
      // Update followers list
      const updatedProfile = {...profile};
      updatedProfile.followers = (updatedProfile.followers || []).filter(id => id !== currentUser.id);
      updatedProfile.followersCount = Math.max((updatedProfile.followersCount || 0) - 1, 0);
      setProfile(updatedProfile);
      
      // Refresh followers list
      fetchFollowers(profile.id).catch(err => console.warn("Failed to refresh followers:", err));
      toast.info(`You unfollowed ${profile.username}`);
    } catch (err) {
      console.error('Error unfollowing user:', err);
      toast.error('Failed to unfollow user');
    }
  };
  
  const handleRemoveFollower = async (followerId) => {
    if (!currentUser || !profile) return;
    
    try {
      await userApi.removeFollower(profile.id, followerId);
      
      // Update followers list
      setFollowers(prev => prev.filter(user => user.id !== followerId));
      
      // Update profile
      const updatedProfile = {...profile};
      updatedProfile.followers = (updatedProfile.followers || []).filter(id => id !== followerId);
      updatedProfile.followersCount = Math.max((updatedProfile.followersCount || 0) - 1, 0);
      setProfile(updatedProfile);
      
      toast.info('Follower removed');
    } catch (err) {
      console.error('Error removing follower:', err);
      toast.error('Failed to remove follower');
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    
    try {
      await userApi.deleteUser(currentUser.id);
      
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
  /*
  const handleDeletePost = async (postId) => {
    try {
      await postApi.deletePost(postId);
      
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
      await postApi.savePost(postId);
      
      toast.success('Post saved');
      fetchSavedPosts().catch(err => console.warn("Failed to refresh saved posts:", err));
    } catch (err) {
      console.error('Error saving post:', err);
      toast.error('Failed to save post');
    }
  };
  
  const handleUnsavePost = async (postId) => {
    try {
      await postApi.unsavePost(postId);
      
      toast.info('Post removed from saved items');
      setSavedPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error unsaving post:', err);
      toast.error('Failed to remove post from saved items');
    }
  };
  */
  
  // Helper function to generate image URL with timestamp to prevent caching
  const getImageUrl = (path) => {
    if (!path) return '';
    // Add timestamp parameter for cache busting
    return `${path}?t=${Date.now()}`;
  };
  
  // Fallback image for profile and posts
  const fallbackProfileImage = "https://via.placeholder.com/150?text=No+Image";
  const fallbackPostImage = "https://via.placeholder.com/300x300?text=Image+Not+Available";
  
  if (isLoading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!profile) {
    return <div className="error-message">Profile not found</div>;
  }
  
  const isFollowing = currentUser && profile.followers && Array.isArray(profile.followers) && 
    profile.followers.includes(currentUser.id);
  
  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        {/* Profile Image */}
        <div className="profile-image-container">
          <div className="profile-image">
            {profile && profile.profileImage ? (
              <img 
                src={getImageUrl(`/api/users/${profile.id}/profile-image`)}
                alt={`${profile.username}'s profile`} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackProfileImage;
                }}
              />
            ) : (
              <div className="profile-initials">
                {profile && (profile.initials || profile.username?.charAt(0)?.toUpperCase() || '?')}
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
              <span className="stat-number">{profile.followersCount || 0}</span>
              <span className="stat-label">followers</span>
            </div>
            <div 
              className="stat-item clickable"
              onClick={() => setIsFollowingModalOpen(true)}
            >
              <span className="stat-number">{profile.followingCount || 0}</span>
              <span className="stat-label">following</span>
            </div>
          </div>
          
          <div className="profile-details">
            <h2 className="profile-name">{profile.fullName || profile.username}</h2>
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
                <img 
                  src={post.imageUrl || getImageUrl(`/api/posts/${post.id}/image`)} 
                  alt="Post" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackPostImage;
                  }}
                />
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
                <img 
                  src={post.imageUrl || getImageUrl(`/api/posts/${post.id}/image`)} 
                  alt="Post" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackPostImage;
                  }}
                />
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
                            (follower.lastName ? follower.lastName[0] : '')).toUpperCase() || 
                            follower.username?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    
                    <div className="user-info" onClick={() => {
                      setIsFollowersModalOpen(false);
                      navigate(`/profile/${follower.username}`);
                    }}>
                      <div className="user-username">{follower.username}</div>
                      <div className="user-name">
                        {follower.firstName || follower.lastName ? 
                          `${follower.firstName || ''} ${follower.lastName || ''}`.trim() : ''}
                      </div>
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
                            (user.lastName ? user.lastName[0] : '')).toUpperCase() || 
                            user.username?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    
                    <div className="user-info" onClick={() => {
                      setIsFollowingModalOpen(false);
                      navigate(`/profile/${user.username}`);
                    }}>
                      <div className="user-username">{user.username}</div>
                      <div className="user-name">
                        {user.firstName || user.lastName ? 
                          `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''}
                      </div>
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