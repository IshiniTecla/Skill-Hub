import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Send, 
  Users, 
  UserMinus, 
  Settings, 
  Share2,
  Info,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../css/group.css';

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const messageEndRef = useRef(null);

  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  // Fetch group details
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoading(true);
        const groupResponse = await axios.get(`http://localhost:8080/api/groups/${groupId}`);
        setGroup(groupResponse.data);
        
        // Fetch messages
        const messagesResponse = await axios.get(`http://localhost:8080/api/group-messages/group/${groupId}`);
        setMessages(messagesResponse.data);
        
        // Fetch posts
        const postsResponse = await axios.get(`http://localhost:8080/api/group-posts/group/${groupId}`);
        setPosts(postsResponse.data);
        
        setError('');
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError('Failed to load group. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        groupId,
        userId: currentUser.id,
        content: newMessage,
        timestamp: Date.now()
      };

      const response = await axios.post('http://localhost:8080/api/group-messages/send', messageData);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  const leaveGroup = async () => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      try {
        await axios.put(`http://localhost:8080/api/groups/${groupId}/leave/${currentUser.id}`);
        navigate('/groups');
      } catch (err) {
        console.error('Error leaving group:', err);
        setError('Failed to leave group. Please try again.');
      }
    }
  };

  const createPost = async (content) => {
    try {
      const postData = {
        groupId,
        postedByUserId: currentUser.id,
        postedByUsername: currentUser.username || currentUser.firstName,
        text: content,
        createdAt: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:8080/api/group-posts', postData);
      setPosts([response.data, ...posts]);
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading group data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!group) {
    return <div className="empty-state">Group not found</div>;
  }

  const isUserMember = group.members && group.members.includes(currentUser.id);
  const isAdmin = group.adminId === currentUser.id || group.ownerId === currentUser.id;

  return (
    <div className="group-detail-container">
      <div className="group-detail-header">
        <div className="header-left">
          <button 
            className="back-button" 
            onClick={() => navigate('/groups')}
          >
            <ArrowLeft size={20} />
          </button>
          <h2>{group.name}</h2>
        </div>
        <div className="header-actions">
          <button className="icon-button" onClick={() => alert('Share functionality to be implemented')}>
            <Share2 size={20} />
          </button>
          <button className="icon-button" onClick={() => alert('Group info modal to be implemented')}>
            <Info size={20} />
          </button>
          {isAdmin && (
            <button className="icon-button" onClick={() => navigate(`/groups/${groupId}/settings`)}>
              <Settings size={20} />
            </button>
          )}
          {isUserMember && !isAdmin && (
            <button className="icon-button danger" onClick={leaveGroup}>
              <UserMinus size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="group-detail-tabs">
        <button 
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Messages
        </button>
        <button 
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button 
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
      </div>

      <div className="group-detail-content">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-messages">
                  <div className="empty-icon">
                    <MessageCircle size={48} />
                  </div>
                  <p>No messages yet</p>
                  <p className="empty-subtitle">Be the first to send a message in this group!</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message ${message.userId === currentUser.id ? 'message-mine' : 'message-other'}`}
                  >
                    {message.userId !== currentUser.id && (
                      <div className="message-sender">{message.senderName || `User ${message.userId.substring(0, 5)}`}</div>
                    )}
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {new Date(message.timestamp || message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messageEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-button">
                <Send size={20} />
              </button>
            </form>
          </>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="posts-container">
            {isUserMember && (
              <div className="create-post-container">
                <textarea
                  placeholder="Share something with the group..."
                  rows={3}
                  className="post-input"
                  id="post-content"
                ></textarea>
                <button 
                  className="post-button"
                  onClick={() => {
                    const content = document.getElementById('post-content').value;
                    if (content.trim()) {
                      createPost(content);
                      document.getElementById('post-content').value = '';
                    }
                  }}
                >
                  Post
                </button>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="empty-posts">
                <p>No posts yet</p>
                <p className="empty-subtitle">Be the first to post in this group!</p>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <div className="post-user">
                        <div className="user-avatar">
                          {post.postedByUsername?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="post-user-name">{post.postedByUsername || `User ${post.postedByUserId.substring(0, 5)}`}</div>
                      </div>
                      <div className="post-time">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="post-content">
                      <p>{post.text || post.content}</p>
                      {post.mediaUrl && (
                        <img src={post.mediaUrl} alt="Post media" style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '8px' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="members-container">
            <div className="members-count">
              <Users size={20} />
              <span>{group.members?.length || 0} members</span>
            </div>

            <div className="members-list">
              {group.members?.map((memberId, index) => (
                <div key={index} className="member-item">
                  <div className="member-avatar">
                    {String(index + 1)}
                  </div>
                  <div className="member-name">
                    {`User ${memberId.substring(0, 8)}`}
                    {(memberId === group.adminId || memberId === group.ownerId) && <span className="admin-badge">Admin</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;