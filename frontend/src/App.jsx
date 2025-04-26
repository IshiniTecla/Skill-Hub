import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LearningPlansList from './components/LearningPlansList';
import AddLearningPlan from './components/AddLearningPlan';
// import UpdateLearningPlan from './components/UpdateLearningPlan';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Learning Plans</h1>
        <Routes>
          <Route path="/" element={<AddLearningPlan />} />
          {/* Uncomment the following routes when you're ready */}
          {/* <Route exact path="/" element={<LearningPlansList />} /> */}
          {/* <Route path="/update/:id" element={<UpdateLearningPlan />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
