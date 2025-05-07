import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Users, Plus, MessageCircle, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
//import '../css/groups.css';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/groups");
        setGroups(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load groups. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const joinGroup = async (groupId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/groups/${groupId}/join/${currentUser.id}`
      );

      // Update the local state with the updated group
      setGroups(
        groups.map((group) => (group.id === groupId ? response.data : group))
      );
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Failed to join group. Please try again.");
    }
  };

  const isUserMember = (group) => {
    return group.members && group.members.includes(currentUser.id);
  };

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h1 className="groups-title">Groups</h1>
        <Link to="/groups/create" className="create-group-button">
          <Plus size={18} />
          <span>Create Group</span>
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading groups...</div>
      ) : (
        <div className="groups-grid">
          {groups.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <h3>No Groups Found</h3>
              <p>Create a new group or join existing ones</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="group-card">
                <div className="group-card-header">
                  <div className="group-icon">
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="group-info">
                    <h3 className="group-name">{group.name}</h3>
                    <p className="group-members">
                      {group.members?.length || 0} members
                    </p>
                  </div>
                </div>
                <div className="group-description">
                  <p>{group.description}</p>
                </div>
                <div className="group-actions">
                  {isUserMember(group) ? (
                    <Link
                      to={`/groups/${group.id}`}
                      className="view-group-button"
                    >
                      <MessageCircle size={16} />
                      <span>View Group</span>
                    </Link>
                  ) : (
                    <button
                      className="join-group-button"
                      onClick={() => joinGroup(group.id)}
                    >
                      <UserPlus size={16} />
                      <span>Join Group</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;
