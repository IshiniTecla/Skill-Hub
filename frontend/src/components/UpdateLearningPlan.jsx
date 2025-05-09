// UpdateLearningPlan.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 

const UpdateLearningPlan = () => {
  const { id } = useParams();  // Capture the dynamic id from the URL
  const [plan, setPlan] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseType, setCourseType] = useState('');
  const [courseFee, setCourseFee] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch plan data from backend based on the id
    axios.get(`http://localhost:8080/api/plans/${id}`)
      .then(response => {
        setPlan(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCourseType(response.data.courseType);
        setCourseFee(response.data.courseFee);
      })
      .catch(error => console.log('Error fetching plan:', error));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();  // Prevent default form submission

    const updatedPlan = {
      title,
      description,
      courseType,
      courseFee,
    };

    // Update the plan via PUT request
    axios.put(`http://localhost:8080/api/plans/${id}`, updatedPlan)
      .then(response => {
        console.log('Plan updated:', response.data);
        navigate(`/plan/${id}`);  // Navigate to the detailed view of the updated plan
      })
      .catch(error => console.log('Error updating plan:', error));
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="form-container">
      <h1>UPDATE LEARNING PLAN</h1>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Plan Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter plan title"
          />
        </div>

        <div className="form-group">
          <label>Plan Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter plan description"
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>Course Type:</label>
          <select
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {courseType === 'paid' && (
          <div className="form-group">
            <label>Course Fee:</label>
            <input
              type="number"
              value={courseFee}
              onChange={(e) => setCourseFee(e.target.value)}
              placeholder="Enter course fee"
            />
          </div>
        )}

        <div className="form-buttons">
          <button type="submit">Update Plan</button>
          <button type="button" onClick={() => navigate(`/plan/${id}`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLearningPlan;
