import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Users,
  Send,
  MoreVertical,
  Trash2,
  Edit,
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Crown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import GroupService from "../../services/GroupService";
import MessageService from "../../services/MessageService";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import "../../css/group-view.css";

const GroupView = () => {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);
  const messageOptionsRef = useRef(null);

  useEffect(() => {
    fetchGroupData();
    const messageInterval = setInterval(fetchMessages, 10000); // Poll for new messages every 10 seconds
    
    // Add click outside listener for message options
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      clearInterval(messageInterval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [groupId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const handleClickOutside = (event) => {
    if (messageOptionsRef.current && !messageOptionsRef.current.contains(event.target)) {
      setShowOptions(null);
    }
  };

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const groupData = await GroupService.getGroupById(groupId);
      setGroup(groupData);
      
      // Check if user is a member of this group
      if (!isUserMember(groupData)) {
        navigate("/groups");
        return;
      }
      
      fetchMessages();
      fetchMembers();
    } catch (err) {
      console.error("Error fetching group:", err);
      setError("Failed to load group. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const messageData = await MessageService.getGroupMessages(groupId);
      setMessages(messageData);
    } catch (err) {
      console.error("Error fetching messages:", err);
      // Don't set error here to avoid disrupting the user experience if message fetch fails
    }
  };

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const memberData = await GroupService.getGroupMembers(groupId);
      setMembers(memberData);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setMembersLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isUserMember = (groupData) => {
    return (
      groupData.members &&
      Array.isArray(groupData.members) &&
      groupData.members.includes(currentUser.id)
    );
  };

  const isUserOwner = () => {
    return group && group.ownerId === currentUser.id;
  };

  const isMessageAuthor = (message) => {
    return message.userId === currentUser.id;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        content: newMessage,
        groupId: groupId,
        userId: currentUser.id,
        userName: currentUser.displayName || currentUser.email
      };

      await MessageService.sendMessage(messageData);
      setNewMessage("");
      fetchMessages(); // Refresh messages
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleEditMessage = async () => {
    if (!editMessageContent.trim()) return;

    try {
      await MessageService.updateMessage(editingMessageId, { content: editMessageContent });
      setEditingMessageId(null);
      setEditMessageContent("");
      fetchMessages(); // Refresh messages
    } catch (err) {
      console.error("Error updating message:", err);
      setError("Failed to update message. Please try again.");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await MessageService.deleteMessage(messageId);
      fetchMessages(); // Refresh messages
      setShowOptions(null);
    } catch (err) {
      console.error("Error deleting message:", err);
      setError("Failed to delete message. Please try again.");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + 
           date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const findMemberName = (userId) => {
    const member = members.find(m => m.id === userId);
    return member ? (member.displayName || member.email) : "Unknown User";
  };

  const leaveGroup = async () => {
    try {
      await GroupService.leaveGroup(groupId);
      navigate("/groups");
    } catch (err) {
      console.error("Error leaving group:", err);
      setError("Failed to leave group. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="group-view-loading">
        <Loading message="Loading group..." />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="group-view-container">
      <div className="group-view-header">
        <Link to="/groups" className="group-view-back">
          <ArrowLeft size={20} />
          <span>Back to Groups</span>
        </Link>
        <div className="group-view-title-container">
          <div className="group-view-avatar">
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div className="group-view-info">
            <h1 className="group-view-title">{group.name}</h1>
            <div className="group-view-meta">
              <span className="group-view-members" onClick={() => setShowMembers(!showMembers)}>
                <Users size={16} />
                {group.members?.length || 0} members
              </span>
              {isUserOwner() && (
                <span className="group-view-owner-badge">
                  <Crown size={14} />
                  Owner
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="group-view-actions">
          {isUserOwner() ? (
            <button 
              className="group-view-manage-button"
              onClick={() => navigate(`/groups/${groupId}/manage`)}
            >
              Manage Group
            </button>
          ) : (
            <button className="group-view-leave-button" onClick={leaveGroup}>
              Leave Group
            </button>
          )}
        </div>
      </div>

      {/* Members panel (hidden by default) */}
      {showMembers && (
        <div className="group-view-members-panel">
          <div className="group-view-members-header">
            <h3>Group Members</h3>
            <button onClick={() => setShowMembers(false)}>Close</button>
          </div>
          {membersLoading ? (
            <Loading message="Loading members..." />
          ) : (
            <ul className="group-view-members-list">
              {members.map((member) => (
                <li key={member.id} className="group-view-member-item">
                  <div className="group-view-member-avatar">
                    {(member.displayName || member.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="group-view-member-info">
                    <span className="group-view-member-name">
                      {member.displayName || member.email}
                    </span>
                    {member.id === group.ownerId && (
                      <span className="group-view-member-badge">
                        <Crown size={12} />
                        Owner
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="group-view-description">
        <p>{group.description || "No description available"}</p>
        <div className="group-view-created">
          <Calendar size={14} />
          <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="group-view-content">
        <div className="group-view-messages">
          {messages.length === 0 ? (
            <div className="group-view-empty-messages">
              <div className="group-view-empty-icon">
                <MessageIcon size={48} />
              </div>
              <p>No messages yet. Be the first to say hello!</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`group-view-message ${isMessageAuthor(message) ? 'own-message' : ''}`}
                >
                  <div className="group-view-message-header">
                    <div className="group-view-message-user">
                      <span className="group-view-message-avatar">
                        {findMemberName(message.userId).charAt(0).toUpperCase()}
                      </span>
                      <span className="group-view-message-name">
                        {findMemberName(message.userId)}
                      </span>
                    </div>
                    <div className="group-view-message-meta">
                      <span className="group-view-message-time">
                        <Clock size={12} />
                        {formatTimestamp(message.createdAt)}
                      </span>
                      {isMessageAuthor(message) && (
                        <div className="group-view-message-options">
                          <button
                            className="group-view-message-options-button"
                            onClick={() => setShowOptions(showOptions === message.id ? null : message.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {showOptions === message.id && (
                            <div 
                              className="group-view-message-options-menu"
                              ref={messageOptionsRef}
                            >
                              <button 
                                className="group-view-message-option"
                                onClick={() => {
                                  setEditingMessageId(message.id);
                                  setEditMessageContent(message.content);
                                  setShowOptions(null);
                                }}
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              <button 
                                className="group-view-message-option delete"
                                onClick={() => handleDeleteMessage(message.id)}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {editingMessageId === message.id ? (
                    <div className="group-view-message-edit">
                      <textarea
                        value={editMessageContent}
                        onChange={(e) => setEditMessageContent(e.target.value)}
                        autoFocus
                      />
                      <div className="group-view-message-edit-actions">
                        <button 
                          className="group-view-message-edit-cancel"
                          onClick={() => {
                            setEditingMessageId(null);
                            setEditMessageContent("");
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          className="group-view-message-edit-save"
                          onClick={handleEditMessage}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group-view-message-content">
                      {message.content}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form className="group-view-message-form" onSubmit={handleSendMessage}>
          <textarea
            className="group-view-message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button 
            type="submit" 
            className="group-view-message-submit"
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

// Custom Message icon component
const MessageIcon = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default GroupView;