import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LearningPlanDetail = () => {
  const { id } = useParams();  // Get the plan ID from the URL
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/plans/${id}`)  // Fetch details of the selected plan
      .then(response => {
        setPlan(response.data);
      })
      .catch(error => console.log(error));
  }, [id]);

  if (!plan) return <div>Loading...</div>;

  const handleDelete = () => {
    // Send a DELETE request to the API to delete the plan
    axios.delete(`http://localhost:8080/api/plans/${id}`)
      .then(response => {
        alert('Learning Plan Deleted Successfully');
        navigate("/learning-plans");  // Navigate back to the list of learning plans
      })
      .catch(error => {
        console.log(error);
        alert('Failed to delete the learning plan');
      });
  };

  const handleUpdate = () => {
    navigate(`/update-learning-plan/${id}`); // Navigate to the update page
  };

  return (
    <div className="learning-plan-detail-container">
      <button className="back-btn" onClick={() => window.history.back()}>← Back to Plans</button>
      
      <div className="learning-plan-header">
        {/* Plan Title and Status */}
        <h1>{plan.title}</h1>
        <div className={`status ${plan.courseType === 'paid' ? 'paid' : 'free'}`}>
          {plan.courseType === 'paid' ? (
            <>
              <span className="status-label">Paid</span>
              <span className="fee">- ${plan.courseFee}</span>
            </>
          ) : (
            <span className="status-label free">FREE</span>
          )}
        </div>
      </div>
      
      {/* Plan Details */}
      <div className="plan-description">
        <h2>Description</h2>
        <p>{plan.description}</p>

        <div className="plan-meta">
          <h3>Creator: <span>{plan.author}</span></h3>
          <h3>Category: <span>{plan.courseCategory}</span></h3>
        </div>
        
        {/* Additional Notes Section */}
        <div className="additional-notes">
          <h3>Additional Notes:</h3>
          <p>{plan.authorNote || 'No additional notes'}</p>
        </div>

        {/* Update and Delete Buttons */}
        <div className="action-buttons">
          <button className="update-btn" onClick={handleUpdate}>Update</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {/* Course Content Section (if available) */}
      {plan.courseContent && plan.courseContent.length > 0 && (
        <div className="course-content">
          <h3>Course Content</h3>
          <ul>
            {plan.courseContent.map((step, index) => (
              <li key={index} className="course-step">
                <strong>{step.title}</strong>: {step.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LearningPlanDetail;
