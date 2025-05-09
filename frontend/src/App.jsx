import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearningPlanList from './components/LearningPlanList';
import AddLearningPlan from './components/AddLearningPlan';
import LearningPlanDetail from './components/LearningPlanDetail';
import DeleteLearningPlan from './components/DeleteLearningPlan'
import UpdateLearningPlan from './components/UpdateLearningPlan';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AddLearningPlan />} />
           <Route exact path="/learning-plans" element={<LearningPlanList />} />
           <Route exact path="/plan/:id" element={<LearningPlanDetail />} />
           <Route path="/delete-learning-plan/:id" element={<DeleteLearningPlan />} />

          <Route path="/update-learning-plan/:id" element={<UpdateLearningPlan />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
