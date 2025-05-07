import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import SkillFormCard from './pages/SkillFormCard';
import './App.css';
import SkillCard from './pages/SkillCard';
import SkillEditCard from './pages/SkillEditCard';
import SkillEndorseCard from './pages/SkillEndorseCard';
import EditEndorsementCard from './pages/EditEndorsementCard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Use '/' for the root route */}
        <Route path="/" element={<Home />} />
        <Route path="/skills/add" element={<SkillFormCard />} />
        <Route path="/skill-card" element={<SkillCard />} />
        <Route path="/skill-endorsecard" element={<SkillEndorseCard />} />
        <Route path="/skills/edit/:id" element={<SkillEditCard />} />
        <Route path="/edit-endorsement/:skilId" element={<EditEndorsementCard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
