import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import GroupService from "../../services/GroupService";
import { useAuth } from "../../context/AuthContext";
import "../../css/GroupCreate.css";

const GroupCreate = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdGroup, setCreatedGroup] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Effect to navigate after showing success message
  useEffect(() => {
    let timer;
    if (success && createdGroup) {
      timer = setTimeout(() => {
        navigate(`/groups/${createdGroup.id}`);
      }, 2000); // Navigate after 2 seconds
    }
    return () => clearTimeout(timer);
  }, [success, createdGroup, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name.trim()) {
      setError("Group name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Check if user is logged in
      if (!currentUser) {
        setError("You must be logged in to create a group");
        setLoading(false);
        return;
      }
      
      const newGroup = await GroupService.createGroup({
        name: formData.name,
        description: formData.description,
      });
      
      // Set success state and store created group
      setCreatedGroup(newGroup);
      setSuccess(true);
      
      // Reset the form
      setFormData({
        name: "",
        description: "",
      });
    } catch (err) {
      console.error("Error creating group:", err);
      setError(err.message || "Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="groupCreate-container">
      <button
        onClick={() => navigate("/groups")}
        className="groupCreate-back-button"
      >
        <ArrowLeft size={16} className="groupCreate-back-icon" />
        Back to Groups
      </button>

      <div className="groupCreate-form-container">
        <h1 className="groupCreate-title">Create New Group</h1>

        {error && (
          <div className="groupCreate-error">
            {error}
          </div>
        )}

        {success && (
          <div className="groupCreate-success">
            <CheckCircle size={20} className="groupCreate-success-icon" />
            <span>Group "{createdGroup?.name}" created successfully! Redirecting...</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="groupCreate-form-group">
              <label
                htmlFor="name"
                className="groupCreate-label"
              >
                Group Name <span className="groupCreate-required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="groupCreate-input"
                placeholder="Enter group name"
                required
              />
            </div>

            <div className="groupCreate-form-group">
              <label
                htmlFor="description"
                className="groupCreate-label"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="groupCreate-textarea"
                placeholder="Describe the purpose of your group"
              ></textarea>
            </div>

            <div className="groupCreate-button-container">
              <button
                type="button"
                onClick={() => navigate("/groups")}
                className="groupCreate-cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="groupCreate-submit-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Group"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GroupCreate;