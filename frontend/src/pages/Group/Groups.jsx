import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  MessageCircle,
  UserPlus,
  User,
  Crown,
  Clock,
  Search,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import GroupService from "../../services/GroupService";
import Loading from "../../components/common/Loading";
import ErrorAlert from "../../components/common/ErrorAlert";
import "../../css/group.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, joined, owned, new
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Define what counts as "new" (e.g., created in the last 7 days)
  const NEW_GROUP_DAYS = 7;

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await GroupService.getAllGroups();
      setGroups(data);
      setError("");
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      setLoading(true);
      const updatedGroup = await GroupService.joinGroup(groupId);

      // Update the group in the local state
      setGroups(
        groups.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group
        )
      );

      setError("");
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Failed to join group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isUserMember = (group) => {
    return (
      group.members &&
      Array.isArray(group.members) &&
      group.members.includes(currentUser.id)
    );
  };

  const isUserOwner = (group) => {
    return group.ownerId === currentUser.id;
  };

  const isNewGroup = (group) => {
    // Check if the group was created within the last NEW_GROUP_DAYS days
    if (!group.createdAt) return false;

    const createdDate = new Date(group.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= NEW_GROUP_DAYS;
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredGroups = () => {
    // First filter by search term if present
    let filtered = searchTerm
      ? groups.filter(group => 
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : groups;

    // Then apply category filters
    switch (filter) {
      case "joined":
        return filtered.filter(
          (group) => isUserMember(group) && !isUserOwner(group)
        );
      case "owned":
        return filtered.filter((group) => isUserOwner(group));
      case "new":
        return filtered.filter((group) => isNewGroup(group) && !isUserOwner(group));
      default:
        return filtered; // "all" shows all groups
    }
  };

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h1 className="groups-title">Groups</h1>
        <div className="groups-header-actions">
          {showSearch ? (
            <div className="groups-search-container">
              <input
                type="text"
                className="groups-search-input"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus
              />
              <button className="groups-search-close" onClick={toggleSearch}>
                <X size={18} />
              </button>
            </div>
          ) : (
            <button className="groups-search-button" onClick={toggleSearch}>
              <Search size={18} />
            </button>
          )}
          <Link to="/groups/create" className="groups-create-button">
            <Plus size={18} />
            <span>Create Group</span>
          </Link>
        </div>
      </div>

      <div className="groups-filter">
        <button
          className={`groups-filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          <Users size={16} />
          <span>All Groups</span>
        </button>
        <button
          className={`groups-filter-button ${
            filter === "joined" ? "active" : ""
          }`}
          onClick={() => setFilter("joined")}
        >
          <User size={16} />
          <span>Joined Groups</span>
        </button>
        <button
          className={`groups-filter-button ${
            filter === "owned" ? "active" : ""
          }`}
          onClick={() => setFilter("owned")}
        >
          <Crown size={16} />
          <span>My Groups</span>
        </button>
        <button
          className={`groups-filter-button ${filter === "new" ? "active" : ""}`}
          onClick={() => setFilter("new")}
        >
          <Clock size={16} />
          <span>New Groups</span>
        </button>
      </div>

      {error && <ErrorAlert message={error} className="groups-error" />}

      {loading ? (
        <div className="groups-loading">
          <Loading message="Loading groups..." />
        </div>
      ) : (
        <div className="groups-grid">
          {filteredGroups().length === 0 ? (
            <div className="groups-empty">
              <Users size={48} className="groups-empty-icon" />
              <h3 className="groups-empty-title">No Groups Found</h3>
              {searchTerm ? (
                <p className="groups-empty-message">
                  No groups match your search term
                </p>
              ) : filter === "all" ? (
                <p className="groups-empty-message">
                  Create a new group or join existing ones
                </p>
              ) : filter === "joined" ? (
                <p className="groups-empty-message">
                  You haven't joined any groups yet
                </p>
              ) : filter === "owned" ? (
                <p className="groups-empty-message">
                  You haven't created any groups yet
                </p>
              ) : (
                <p className="groups-empty-message">
                  No new groups have been created recently
                </p>
              )}
              {(filter !== "all" || searchTerm) && (
                <button
                  className="groups-empty-action"
                  onClick={() => {
                    setFilter("all");
                    setSearchTerm("");
                    setShowSearch(false);
                  }}
                >
                  Show all groups
                </button>
              )}
            </div>
          ) : (
            filteredGroups().map((group) => (
              <div key={group.id} className="groups-card">
                <div className="groups-card-content">
                  <div className="groups-card-header">
                    <div className="groups-card-avatar">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="groups-card-info">
                      <h3 className="groups-card-name">
                        {group.name}
                        {isNewGroup(group) && (
                          <span className="groups-card-new-badge">NEW</span>
                        )}
                      </h3>
                      <div className="groups-card-meta">
                        <span className="groups-card-members">
                          {group.members?.length || 0} members
                        </span>
                        {isUserOwner(group) && (
                          <span className="groups-card-owner-badge">
                            <Crown size={12} />
                            Owner
                          </span>
                        )}
                        {isUserMember(group) && !isUserOwner(group) && (
                          <span className="groups-card-member-badge">
                            <User size={12} />
                            Member
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="groups-card-description">
                    <p>{group.description || "No description available"}</p>
                  </div>
                  <div className="groups-card-actions">
                    {isUserMember(group) ? (
                      <Link
                        to={`/groups/${group.id}`}
                        className="groups-view-button"
                      >
                        <MessageCircle size={16} />
                        <span>View Group</span>
                      </Link>
                    ) : (
                      <button
                        className="groups-join-button"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        <UserPlus size={16} />
                        <span>Join Group</span>
                      </button>
                    )}
                    {isUserOwner(group) && (
                      <button
                        className="groups-manage-button"
                        onClick={() => navigate(`/groups/${group.id}/manage`)}
                      >
                        <span>Manage</span>
                      </button>
                    )}
                  </div>
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