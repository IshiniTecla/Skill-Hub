import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Users, 
  Crown, 
  LogOut, 
  Settings,
  MessageSquare
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import GroupService from "../../services/GroupService";
import UserService from "../../services/UserService";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import "../../css/GroupDetail.css";

const GroupDetail = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const groupData = await GroupService.getGroupById(id);
      setGroup(groupData);
      
      // Fetch group members
      const membersData = await GroupService.getGroupMembers(id);
      setMembers(membersData);
      
      setError("");
    } catch (err) {
      console.error("Error fetching group details:", err);
      setError("Failed to load group details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) {
      return;
    }
    
    try {
      setLoading(true);
      await GroupService.leaveGroup(id);
      navigate("/groups");
    } catch (err) {
      console.error("Error leaving group:", err);
      setError("Failed to leave group. Please try again.");
      setLoading(false);
    }
  };

  const isUserOwner = () => {
    return group && group.ownerId === currentUser.id;
  };

  const isUserMember = () => {
    return group && group.members && Array.isArray(group.members) && 
           group.members.includes(currentUser.id);
  };

  if (loading) {
    return (
      <div className="group-detail-loading">
        <Loading message="Loading group details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="group-detail-error-container">
        <ErrorAlert message={error} />
        <Link to="/groups" className="group-detail-back-link">
          <ArrowLeft size={16} />
          <span>Back to Groups</span>
        </Link>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="group-detail-not-found">
        <h2>Group not found</h2>
        <Link to="/groups" className="group-detail-back-link">
          <ArrowLeft size={16} />
          <span>Back to Groups</span>
        </Link>
      </div>
    );
  }

  // If user is not a member and trying to access directly, redirect to groups page
  if (!isUserMember()) {
    return (
      <div className="group-detail-unauthorized">
        <h2>You are not a member of this group</h2>
        <p>Join this group to view its content</p>
        <div className="group-detail-actions">
          <button 
            className="group-detail-join-button"
            onClick={async () => {
              try {
                setLoading(true);
                await GroupService.joinGroup(id);
                fetchGroupDetails();
              } catch (err) {
                setError("Failed to join group. Please try again.");
                setLoading(false);
              }
            }}
          >
            Join Group
          </button>
          <Link to="/groups" className="group-detail-back-link">
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group-detail-container">
      <div className="group-detail-header">
        <div className="group-detail-nav">
          <Link to="/groups" className="group-detail-back-button">
            <ArrowLeft size={16} />
            <span>Back to Groups</span>
          </Link>
          <div className="group-detail-actions">
            {isUserOwner() ? (
              <Link to={`/groups/${id}/manage`} className="group-detail-settings-button">
                <Settings size={16} />
                <span>Manage Group</span>
              </Link>
            ) : (
              <button className="group-detail-leave-button" onClick={handleLeaveGroup}>
                <LogOut size={16} />
                <span>Leave Group</span>
              </button>
            )}
          </div>
        </div>

        <div className="group-detail-info">
          <div className="group-detail-avatar">
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="group-detail-name">{group.name}</h1>
            <div className="group-detail-meta">
              <span className="group-detail-members">
                <Users size={14} />
                {group.members?.length || 0} members
              </span>
              {isUserOwner() && (
                <span className="group-detail-owner-badge">
                  <Crown size={14} />
                  Owner
                </span>
              )}
            </div>
            <p className="group-detail-description">
              {group.description || "No description available"}
            </p>
          </div>
        </div>
      </div>

      <div className="group-detail-content">
        <div className="group-detail-main">
          <div className="group-detail-section">
            <h2 className="group-detail-section-title">
              <MessageSquare size={18} />
              <span>Group Chat</span>
            </h2>
            <div className="group-detail-chat-placeholder">
              <p>Chat functionality would be implemented here</p>
              <p>This area would contain messages, input field, etc.</p>
            </div>
          </div>
        </div>

        <div className="group-detail-sidebar">
          <div className="group-detail-section">
            <h2 className="group-detail-section-title">
              <Users size={18} />
              <span>Members ({members.length})</span>
            </h2>
            <div className="group-detail-members-list">
              {members.map((member) => (
                <div key={member.id} className="group-detail-member">
                  <div className="group-detail-member-avatar">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="group-detail-member-info">
                    <span className="group-detail-member-name">
                      {member.firstName} {member.lastName}
                    </span>
                    <span className="group-detail-member-username">
                      @{member.username}
                    </span>
                  </div>
                  {member.id === group.ownerId && (
                    <span className="group-detail-member-badge">Owner</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;