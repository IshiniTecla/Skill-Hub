import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteLearningPlan = () => {
  const { id } = useParams();  // Get the id from the URL
  const [plan, setPlan] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');  // State for success message
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the learning plan details based on the id
    axios.get(`http://localhost:8080/api/plans/${id}`)
      .then(response => {
        setPlan(response.data);
      })
      .catch(error => console.log('Error fetching plan:', error));
  }, [id]);

  // Handle delete operation
  const handleDelete = () => {
    axios.delete(`http://localhost:8080/api/plans/${id}`)
      .then(response => {
        setSuccessMessage('Learning Plan Deleted Successfully'); // Set success message
        setTimeout(() => {
          navigate('/learning-plans');  // Redirect to the learning plans list after a short delay
        }, 2000);  // 2 seconds delay before redirect
      })
      .catch(error => console.error('Error deleting plan:', error));
  };

  // Handle cancel and navigate back
  const handleCancel = () => {
    navigate(`/plan/${id}`);  // Navigate back to the individual plan view
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="delete-confirmation-container">
      <div className="delete-plan-header">
        <h2>DELETE LEARNING PLAN</h2>
      </div>

      {/* Show success message if available */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="delete-plan-details">
        <p><strong>Are you sure you want to delete this learning plan?</strong></p>
        <h3>{plan.title}</h3>
        <p>{plan.description}</p>
        <p><strong>Creator:</strong> {plan.author}</p>
        <p><strong>Category:</strong> {plan.courseCategory}</p>
        <p><strong>Status:</strong> {plan.courseType}</p>
        {plan.courseType === 'paid' && <p><strong>Fee:</strong> ${plan.courseFee}</p>}
      </div>

      <div className="delete-plan-buttons">
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteLearningPlan;
