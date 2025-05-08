import React, { useState, useEffect } from 'react';
import './style.css';

const LearningPlansList = () => {
  const [learningPlans, setLearningPlans] = useState([]);

  useEffect(() => {
    // Fetching learning plans from backend
    fetch('http://localhost:8080/api/plans')
      .then((response) => response.json())
      .then((data) => setLearningPlans(data))
      .catch((error) => console.error('Error fetching learning plans:', error));
  }, []);

  return (
    <div className="learning-plans-container">

<div className="header-section">
      <h1 className="header-title">Browse Our Learning Plans</h1>
        <p className="header-subtitle">
          Explore a variety of courses designed to help you grow your skills in programming, design, marketing, and more!
        </p>

</div>


      
      <div className="card-container">
        {learningPlans.map((plan) => (
          <div className="learning-plan-card" key={plan.id}>
            <div className="card-header">
              <img
                src="https://via.placeholder.com/150"
                alt="Course Thumbnail"
                className="card-thumbnail"
              />
            </div>
            <div className="card-body">
              <h2 className="card-title">{plan.title}</h2>
              <p className="card-description">{plan.description}</p>
              <p className="card-creator">Creator: {plan.author}</p>
              <p className="card-category">Category: {plan.courseCategory}</p>
              <p className="card-status">Status: {plan.courseType === 'paid' ? `Paid - $${plan.courseFee}` : 'Free'}</p>
              <button className="card-btn">View Plan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPlansList;
