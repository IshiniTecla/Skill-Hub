import React, { useState } from 'react';
import axios from 'axios';

const AddLearningPlan = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [progress, setProgress] = useState(''); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const apiUrl = 'http://localhost:8080/api/plans'; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (!title || !description || !author || !progress) {
      setError('Please fill in all fields.');
      setSuccessMessage('');
      return;
    }

    try {
      const newPlan = { title, description, author, progress };
      const response = await axios.post(apiUrl, newPlan);
      console.log('Learning plan added successfully:', response.data);
      setError('');
      setSuccessMessage('Learning plan added successfully!');
      // Reset the form after successful submission
      setTitle('');
      setDescription('');
      setAuthor('');
      setProgress('');
    } catch (err) {
      console.error('Error adding learning plan:', err);
      setError('Error adding learning plan. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="container">
      <h1>Add Learning Plan</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleFieldChange(setTitle)}
            placeholder="Enter title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleFieldChange(setDescription)}
            placeholder="Enter description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={handleFieldChange(setAuthor)}
            placeholder="Enter author"
          />
        </div>

        <div className="form-group">
          <label htmlFor="progress">Progress:</label>
          <select
            id="progress"
            value={progress}
            onChange={handleFieldChange(setProgress)}
          >
            <option value="">Select progress</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
            <option value="Not Started">Not Started</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <button type="submit" disabled={!title || !description || !author || !progress}>
          Add Plan
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default AddLearningPlan;
