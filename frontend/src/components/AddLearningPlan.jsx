import React, { useState } from 'react';
import axios from 'axios';
import "./style.css";

const AddLearningPlan = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [authorNote, setAuthorNote] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseType, setCourseType] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const apiUrl = 'http://localhost:8080/api/learning-plans'; // Adjust the API endpoint as needed

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (!title || !description || !author || !authorNote || !courseCategory || !courseType || !thumbnail) {
      setError('Please fill in all fields.');
      setSuccessMessage('');
      return;
    }

    try {
      const newPlan = {
        title, 
        description, 
        author, 
        authorNote, 
        courseCategory, 
        courseType, 
        thumbnail
      };
      const response = await axios.post(apiUrl, newPlan);
      console.log('Learning plan added successfully:', response.data);
      setError('');
      setSuccessMessage('Learning plan added successfully!');
      // Reset the form after successful submission
      setTitle('');
      setDescription('');
      setAuthor('');
      setAuthorNote('');
      setCourseCategory('');
      setCourseType('');
      setThumbnail('');
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
          <label htmlFor="title">Plan Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleFieldChange(setTitle)}
            placeholder="Enter plan title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Plan Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleFieldChange(setDescription)}
            placeholder="Enter plan description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Creator:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={handleFieldChange(setAuthor)}
            placeholder="Enter creator's name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="authorNote">Author Note:</label>
          <input
            type="text"
            id="authorNote"
            value={authorNote}
            onChange={handleFieldChange(setAuthorNote)}
            placeholder="Enter author's note"
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseCategory">Course Category:</label>
          <input
            type="text"
            id="courseCategory"
            value={courseCategory}
            onChange={handleFieldChange(setCourseCategory)}
            placeholder="Enter course category"
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseType">Course Type:</label>
          <input
            type="text"
            id="courseType"
            value={courseType}
            onChange={handleFieldChange(setCourseType)}
            placeholder="Enter course type"
          />
        </div>

        <div className="form-group">
          <label htmlFor="thumbnail">Thumbnail URL:</label>
          <input
            type="text"
            id="thumbnail"
            value={thumbnail}
            onChange={handleFieldChange(setThumbnail)}
            placeholder="Enter thumbnail URL"
          />
        </div>

        <button type="submit" disabled={!title || !description || !author || !authorNote || !courseCategory || !courseType || !thumbnail}>
          Add Plan
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default AddLearningPlan;
