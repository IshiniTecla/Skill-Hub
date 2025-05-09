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
    <div className="learning-plan-detail">
      <h2>{plan.title}</h2>
      <p>{plan.description}</p>
      <p><strong>Creator:</strong> {plan.author}</p>
      <p><strong>Category:</strong> {plan.courseCategory}</p>
      <p><strong>Status:</strong> {plan.status}</p>
      {plan.courseType === 'paid' && <p><strong>Fee:</strong> ${plan.courseFee}</p>}
      {/* Add any other details you'd like to display */}
    </div>
  );
};

export default LearningPlanDetail;
