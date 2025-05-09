import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteLearningPlan = () => {
  const { id } = useParams();  // Get the id from the URL
  const [plan, setPlan] = useState(null);
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
        console.log('Plan deleted:', response.data);
        navigate('/learning-plans');  // Redirect to the learning plans list
      })
      .catch(error => console.error('Error deleting plan:', error));
  };

  // Handle cancel and navigate back
  const handleCancel = () => {
    navigate('/learning-plans');  // Navigate back to the list of plans
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="delete-confirmation-container">
      <div className="delete-plan-header">
        <h2>DELETE LEARNING PLAN</h2>
      </div>

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
