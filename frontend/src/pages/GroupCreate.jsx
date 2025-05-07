import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, ArrowLeft } from 'lucide-react';
import '../css/group.css';

const GroupCreate = () => {
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!groupData.name.trim()) {
      setError('Group name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await axios.post(
        'http://localhost:8080/api/groups/create', 
        groupData
      );
      
      console.log('Group created:', response.data);
      navigate('/groups');
    } catch (err) {
      console.error('Error creating group', err);
      setError('Group creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="group-create-container">
      <div className="group-create-header">
        <button 
          className="back-button" 
          onClick={() => navigate('/groups')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Create New Group</h1>
      </div>

      <div className="group-create-form-container">
        <div className="group-icon-large">
          <Users size={48} />
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="group-create-form">
          <div className="form-group">
            <label htmlFor="name">Group Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter group name"
              value={groupData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="What is this group about?"
              value={groupData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={4}
              maxLength={500}
            />
          </div>

          <button 
            type="submit" 
            className="create-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupCreate;