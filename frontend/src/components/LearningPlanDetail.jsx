import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LearningPlanDetail = () => {
  const { id } = useParams();  // Get the plan ID from the URL
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/plans/${id}`)  // Fetch details of the selected plan
      .then(response => {
        setPlan(response.data);
      })
      .catch(error => console.log(error));
  }, [id]);

  if (!plan) return <div>Loading...</div>;

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
            <span className="status-label free">Free</span>
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

        {/* Enroll Button */}
        <div className="enroll-section">
          <button className="enroll-btn">Enroll Now</button>
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
