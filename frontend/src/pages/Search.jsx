import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, UserCheck, UserPlus, X } from 'lucide-react';
import '../css/Search.css'; // Import the CSS file

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  // Fetch current user profile on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setFilteredUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeUserProfile = () => {
    setSelectedUser(null);
  };

  const isFollowing = (userId) => {
    if (!currentUser || !currentUser.following) return false;
    return currentUser.following.some(followedUser => followedUser.id === userId);
  };

  const handleFollow = async (userId) => {
    if (!currentUser) return;
    
    try {
      setFollowLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/${currentUser.id}/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Update current user state with new following data
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    if (!currentUser) return;
    
    try {
      setFollowLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/${currentUser.id}/unfollow/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Update current user state with new following data
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Find People</h1>
      
      {/* Search bar */}
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for users by name, username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="search-icon" size={20} />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {/* User list */}
      {!loading && filteredUsers.length === 0 && (
        <div className="empty-state">No users found</div>
      )}

      {!loading && filteredUsers.length > 0 && !selectedUser && (
        <div className="user-grid">
          {filteredUsers.map(user => (
            <div 
              key={user.id} 
              className="user-card"
              onClick={() => handleUserClick(user)}
            >
              <div className="user-avatar">
                {user.profileImage ? (
                  <img 
                    src={`/api/users/${user.id}/profile-image`} 
                    alt={user.username} 
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <h3 className="user-name">{user.name || user.username}</h3>
                <p className="user-username">@{user.username}</p>
              </div>
              {currentUser && currentUser.id !== user.id && (
                <button 
                  className={`follow-button ${
                    isFollowing(user.id) 
                      ? 'follow-button-secondary' 
                      : 'follow-button-primary'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    isFollowing(user.id) ? handleUnfollow(user.id) : handleFollow(user.id);
                  }}
                  disabled={followLoading}
                >
                  {isFollowing(user.id) ? (
                    <>
                      <UserCheck size={16} className="follow-icon" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="follow-icon" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* User profile modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Profile</h2>
              <button onClick={closeUserProfile} className="modal-close">
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Profile header */}
              <div className="profile-header">
                <div className="profile-avatar">
                  {selectedUser.profileImage ? (
                    <img 
                      src={`/api/users/${selectedUser.id}/profile-image`} 
                      alt={selectedUser.username} 
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="profile-name">{selectedUser.name || selectedUser.username}</h3>
                <p className="profile-username">@{selectedUser.username}</p>
                
                {currentUser && currentUser.id !== selectedUser.id && (
                  <button 
                    className={`profile-follow-button ${
                      isFollowing(selectedUser.id) 
                        ? 'follow-button-secondary' 
                        : 'follow-button-primary'
                    }`}
                    onClick={() => {
                      isFollowing(selectedUser.id) ? handleUnfollow(selectedUser.id) : handleFollow(selectedUser.id);
                    }}
                    disabled={followLoading}
                  >
                    {isFollowing(selectedUser.id) ? (
                      <>
                        <UserCheck size={18} className="follow-icon" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} className="follow-icon" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {/* Profile stats */}
              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-value">{selectedUser.followers?.length || 0}</div>
                  <div className="stat-label">Followers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{selectedUser.following?.length || 0}</div>
                  <div className="stat-label">Following</div>
                </div>
              </div>
              
              {/* Profile info */}
              {selectedUser.bio && (
                <div className="profile-section">
                  <h4 className="profile-section-title">Bio</h4>
                  <p className="profile-bio">{selectedUser.bio}</p>
                </div>
              )}
              
              <div className="profile-details">
                <p className="profile-detail">Email: {selectedUser.email}</p>
                {selectedUser.location && <p className="profile-detail">Location: {selectedUser.location}</p>}
                {selectedUser.website && (
                  <p className="profile-detail">
                    Website: <a href={selectedUser.website} className="profile-link" target="_blank" rel="noopener noreferrer">{selectedUser.website}</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}