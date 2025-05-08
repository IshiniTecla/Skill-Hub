import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LearningPlanList from './components/LearningPlanList';
import AddLearningPlan from './components/AddLearningPlan';
// import UpdateLearningPlan from './components/UpdateLearningPlan';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AddLearningPlan />} />
           <Route exact path="/learning-plans" element={<LearningPlanList />} />
          {/* <Route path="/update/:id" element={<UpdateLearningPlan />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
