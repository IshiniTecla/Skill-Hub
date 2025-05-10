import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Users,
  UserMinus,
  Crown,
  Trash2,
  ArrowLeft,
  Save,
  AlertTriangle,
  Search,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import GroupService from "../../services/GroupService";
import UserService from "../../services/UserService";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import "../../css/group-manage.css";

const GroupManage = () => {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State variables
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [nonMembers, setNonMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedNewOwner, setSelectedNewOwner] = useState("");

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  // Fetch group details
  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const groupData = await GroupService.getGroupById(groupId);
      setGroup(groupData);
      setGroupName(groupData.name);
      setGroupDescription(groupData.description || "");
      
      // Check if user is the owner of this group
      if (groupData.ownerId !== currentUser.id) {
        navigate(`/groups/${groupId}`);
        return;
      }
      
      fetchMembers();
      fetchAvailableUsers();
    } catch (err) {
      console.error("Error fetching group:", err);
      setError("Failed to load group. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch group members
  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const memberData = await GroupService.getGroupMembers(groupId);
      setMembers(memberData);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load group members.");
    } finally {
      setMembersLoading(false);
    }
  };

  // Fetch users who are not group members
  const fetchAvailableUsers = async () => {
    try {
      setUsersLoading(true);
      const users = await UserService.getAllUsers();
      const groupData = await GroupService.getGroupById(groupId);
      
      // Filter out users who are already members
      const nonMemberUsers = users.filter(
        user => !groupData.members.includes(user.id)
      );
      
      setNonMembers(nonMemberUsers);
    } catch (err) {
      console.error("Error fetching available users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Update group details
  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }
    
    try {
      setSaving(true);
      const updatedGroupData = {
        name: groupName,
        description: groupDescription
      };
      
      await GroupService.updateGroup(groupId, updatedGroupData);
      setError("");
      navigate(`/groups/${groupId}`);
    } catch (err) {
      console.error("Error updating group:", err);
      setError("Failed to update group. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Remove a member from the group
  const handleRemoveMember = async (memberId) => {
    try {
      await GroupService.removeMember(groupId, memberId);
      fetchMembers();
      fetchAvailableUsers();
    } catch (err) {
      console.error("Error removing member:", err);
      setError("Failed to remove member. Please try again.");
    }
  };

  // Add a new member to the group
  const handleAddMember = async (userId) => {
    try {
      await GroupService.addMember(groupId, userId);
      fetchMembers();
      fetchAvailableUsers();
    } catch (err) {
      console.error("Error adding member:", err);
      setError("Failed to add member. Please try again.");
    }
  };

  // Transfer group ownership to another member
  const handleTransferOwnership = async () => {
    if (!selectedNewOwner) {
      setError("Please select a new owner");
      return;
    }
    
    try {
      await GroupService.transferOwnership(groupId, selectedNewOwner);
      setShowTransferModal(false);
      // Redirect to group view since this user is no longer the owner
      navigate(`/groups/${groupId}`);
    } catch (err) {
      console.error("Error transferring ownership:", err);
      setError("Failed to transfer ownership. Please try again.");
    }
  };

  // Delete the entire group
  const handleDeleteGroup = async () => {
    try {
      await GroupService.deleteGroup(groupId);
      navigate("/groups");
    } catch (err) {
      console.error("Error deleting group:", err);
      setError("Failed to delete group. Please try again.");
    }
  };

  // Filter non-members based on search term
  const filteredNonMembers = nonMembers.filter(user =>
    (user.displayName || user.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state
  if (loading) {
    return (
      <div className="group-manage-loading">
        <Loading message="Loading group..." />
      </div>
    );
  }

  // Show error state
  if (error && !group) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="group-manage-container">
      {/* Header with back button */}
      <div className="group-manage-header">
        <Link to={`/groups/${groupId}`} className="group-manage-back">
          <ArrowLeft size={20} />
          <span>Back to Group</span>
        </Link>
        <h1 className="group-manage-title">Manage Group</h1>
      </div>

      <div className="group-manage-content">
        {/* Group Details Form */}
        <div className="group-manage-section">
          <h2 className="group-manage-section-title">Group Details</h2>
          {error && <ErrorAlert message={error} />}
          <form className="group-manage-form" onSubmit={handleUpdateGroup}>
            <div className="group-manage-form-group">
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div className="group-manage-form-group">
              <label htmlFor="groupDescription">Description</label>
              <textarea
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={4}
                placeholder="Describe your group..."
              />
            </div>
            <button 
              type="submit" 
              className="group-manage-save-button"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Members List Section */}
        <div className="group-manage-section">
          <h2 className="group-manage-section-title">
            <Users size={20} />
            <span>Members ({members.length})</span>
          </h2>
          <div className="group-manage-members">
            {membersLoading ? (
              <Loading message="Loading members..." />
            ) : members.length === 0 ? (
              <div className="group-manage-empty">
                <p>No members in this group</p>
              </div>
            ) : (
              <div className="group-manage-members-list">
                {members.map((member) => (
                  <div key={member.id} className="group-manage-member">
                    <div className="group-manage-member-info">
                      <div className="group-manage-member-avatar">
                        {(member.displayName || member.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="group-manage-member-details">
                        <span className="group-manage-member-name">
                          {member.displayName || member.email}
                        </span>
                        {member.id === group.ownerId && (
                          <span className="group-manage-owner-badge">
                            <Crown size={12} />
                            Owner
                          </span>
                        )}
                      </div>
                    </div>
                    {member.id !== group.ownerId && (
                      <button
                        className="group-manage-remove-button"
                        onClick={() => handleRemoveMember(member.id)}
                        title="Remove member"
                      >
                        <UserMinus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Members Section */}
        <div className="group-manage-section">
          <h2 className="group-manage-section-title">
            <UserPlus size={20} />
            <span>Add Members</span>
          </h2>
          <div className="group-manage-add-members">
            <div className="group-manage-search">
              <Search size={16} className="group-manage-search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="group-manage-search-input"
              />
            </div>
            <div className="group-manage-non-members">
              {usersLoading ? (
                <Loading message="Loading users..." />
              ) : filteredNonMembers.length === 0 ? (
                <div className="group-manage-empty">
                  <p>No users found to add</p>
                </div>
              ) : (
                <div className="group-manage-non-members-list">
                  {filteredNonMembers.map((user) => (
                    <div key={user.id} className="group-manage-non-member">
                      <div className="group-manage-non-member-info">
                        <div className="group-manage-non-member-avatar">
                          {(user.displayName || user.email).charAt(0).toUpperCase()}
                        </div>
                        <span className="group-manage-non-member-name">
                          {user.displayName || user.email}
                        </span>
                      </div>
                      <button
                        className="group-manage-add-button"
                        onClick={() => handleAddMember(user.id)}
                        title="Add member"
                      >
                        <UserPlus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="group-manage-danger-zone">
          <h2 className="group-manage-danger-title">
            <AlertTriangle size={20} />
            <span>Danger Zone</span>
          </h2>
          <div className="group-manage-danger-actions">
            <div className="group-manage-danger-action">
              <div className="group-manage-danger-info">
                <h3>Transfer Ownership</h3>
                <p>Transfer this group to another member</p>
              </div>
              <button 
                className="group-manage-transfer-button"
                onClick={() => setShowTransferModal(true)}
                disabled={members.filter(member => member.id !== currentUser.id).length === 0}
              >
                <Crown size={16} />
                Transfer
              </button>
            </div>
            <div className="group-manage-danger-action">
              <div className="group-manage-danger-info">
                <h3>Delete Group</h3>
                <p>Permanently delete this group and all its data</p>
              </div>
              <button 
                className="group-manage-delete-button"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="group-manage-modal-overlay">
          <div className="group-manage-modal">
            <div className="group-manage-modal-header">
              <AlertTriangle size={24} className="group-manage-modal-icon" />
              <h2>Delete Group</h2>
            </div>
            <div className="group-manage-modal-content">
              <p>Are you sure you want to delete this group? This action cannot be undone and all group data will be permanently lost.</p>
            </div>
            <div className="group-manage-modal-actions">
              <button 
                className="group-manage-modal-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="group-manage-modal-confirm"
                onClick={handleDeleteGroup}
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {showTransferModal && (
        <div className="group-manage-modal-overlay">
          <div className="group-manage-modal">
            <div className="group-manage-modal-header">
              <Crown size={24} className="group-manage-modal-icon" />
              <h2>Transfer Ownership</h2>
            </div>
            <div className="group-manage-modal-content">
              <p>Select a new owner for this group. You will become a regular member.</p>
              <select
                className="group-manage-modal-select"
                value={selectedNewOwner}
                onChange={(e) => setSelectedNewOwner(e.target.value)}
              >
                <option value="">-- Select a member --</option>
                {members
                  .filter(member => member.id !== currentUser.id)
                  .map(member => (
                    <option key={member.id} value={member.id}>
                      {member.displayName || member.email}
                    </option>
                  ))}
              </select>
            </div>
            <div className="group-manage-modal-actions">
              <button 
                className="group-manage-modal-cancel"
                onClick={() => setShowTransferModal(false)}
              >
                Cancel
              </button>
              <button 
                className="group-manage-modal-confirm"
                onClick={handleTransferOwnership}
                disabled={!selectedNewOwner}
              >
                Transfer Ownership
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManage;