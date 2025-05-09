import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  const navigate = useNavigate();  // Initialize useNavigate

  const validateForm = () => {
    if (!title || !description || !author || !courseCategory || !courseType) {
      setError('Please fill in all required fields.');
      setSuccessMessage('');
      return false;
    }

    if (/^\d+$/.test(author)) {
      setError('Author name cannot be a number.');
      setSuccessMessage('');
      return false;
    }

    if (courseType === 'paid' && !courseFee) {
      setError('Please provide a course fee for paid courses.');
      setSuccessMessage('');
      return false;
    }

    if (courseType === 'paid' && courseFee <= 0) {
      setError('Course fee must be a positive number.');
      setSuccessMessage('');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newPlan = {
        title,
        description,
        author,
        authorNote,
        courseCategory,
        courseType,
        courseFee: courseType === 'paid' ? courseFee : null, // Only include courseFee if it's a paid course
      };

      // Send a POST request to the backend
      axios.post('http://localhost:8080/api/plans', newPlan)
        .then((response) => {
          setSuccessMessage('Learning plan added successfully!');
          
        })
        .catch((error) => {
          setError('Failed to add the learning plan. Please try again later.');
          console.log(error);
        });

      // Reset form after submission
      setTitle('');
      setDescription('');
      setAuthor('');
      setAuthorNote('');
      setCourseCategory('');
      setCourseType('');
      setCourseFee('');
    }
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate('/learning-plans')}>Browse our learning plans</button>
      
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
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter plan title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Plan Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter creator's name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="authorNote">Author Note (Optional):</label>
          <textarea
            type="text"
            id="authorNote"
            value={authorNote}
            onChange={(e) => setAuthorNote(e.target.value)}
            placeholder="Enter author's note"
            rows="5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseCategory">Course Category:</label>
          <select
            id="courseCategory"
            value={courseCategory}
            onChange={(e) => setCourseCategory(e.target.value)}
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
            onChange={(e) => setCourseType(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {courseType === 'paid' && (
          <div className="form-group">
            <label htmlFor="courseFee">Course Fee ($):</label>
            <input
              type="number"
              id="courseFee"
              value={courseFee}
              onChange={(e) => setCourseFee(e.target.value)}
              placeholder="Enter course fee"
            />
          </div>
        )}

        <button type="submit" disabled={!title || !description || !author || !courseCategory || !courseType}>
          Add Plan
        </button>
      </form>
    </div>
  );
};

export default AddLearningPlan;
