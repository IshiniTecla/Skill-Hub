import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PostForm from './pages/PostForm';
import PostItem from './pages/PostItem';
import PostList from './pages/PostList';
import Feed from './components/Feed';
import Home from './pages/Home';
import SkillFormCard from './pages/SkillFormCard';
import './App.css';
import SkillCard from './pages/SkillCard';
import SkillEditCard from './pages/SkillEditCard';
import SkillEndorseCard from './pages/SkillEndorseCard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Use '/' for the root route */}
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/view" element={<PostItem />} />
        <Route path="/post-create" element={<PostForm />} />
        <Route path="/skills/add" element={<SkillFormCard />} />
        <Route path="/skill-card" element={<SkillCard />} />
        <Route path="/skill-endorsecard" element={<SkillEndorseCard />} />
        <Route path="/skills/edit/:id" element={<SkillEditCard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
