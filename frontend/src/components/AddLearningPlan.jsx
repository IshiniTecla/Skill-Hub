import React, { useState } from 'react';
import axios from 'axios';
import './style.css';

const AddLearningPlan = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [authorNote, setAuthorNote] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseType, setCourseType] = useState('');
  const [courseFee, setCourseFee] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const apiUrl = 'http://localhost:8080/api/plans'; // Your backend API URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    if (!title || !description || !author || !courseCategory || !courseType || (courseType === 'paid' && !courseFee)) {
      setError('Please fill in all required fields.');
      setSuccessMessage('');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author', author);
    formData.append('authorNote', authorNote); // Optional field
    formData.append('courseCategory', courseCategory);
    formData.append('courseType', courseType);
    formData.append('courseFee', courseFee); // Add course fee when 'Paid' is selected

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setError('');
      setSuccessMessage('Learning plan added successfully!');
      // Reset the form after successful submission
      setTitle('');
      setDescription('');
      setAuthor('');
      setAuthorNote('');
      setCourseCategory('');
      setCourseType('');
      setCourseFee('');
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setError('Error adding learning plan: ' + (err.response ? err.response.data : err.message));
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
      <div className="form-container">
        <h1>ADD LEARNING PLAN</h1>
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

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
            <textarea
              id="description"
              value={description}
              onChange={handleFieldChange(setDescription)}
              placeholder="Enter plan description"
              rows="5"
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
            <label htmlFor="authorNote">Author Note (Optional):</label>
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
            <select
              id="courseCategory"
              value={courseCategory}
              onChange={handleFieldChange(setCourseCategory)}
            >
              <option value="">Select category</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="courseType">Course Type:</label>
            <select
              id="courseType"
              value={courseType}
              onChange={(e) => { setCourseType(e.target.value); setCourseFee(''); }}
            >
              <option value="">Select type</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {courseType === 'paid' && (
            <div className="form-group">
              <label htmlFor="courseFee">Course Fee:</label>
              <input
                type="number"
                id="courseFee"
                value={courseFee}
                onChange={handleFieldChange(setCourseFee)}
                placeholder="Enter course fee"
              />
            </div>
          )}

          <button type="submit" disabled={!title || !description || !author || !courseCategory || !courseType || (courseType === 'paid' && !courseFee)}>
            Add Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLearningPlan;
