import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PostForm from './pages/PostForm';
import PostItem from './pages/PostItem';
import PostList from './pages/PostList';
import Feed from './components/Feed';
import Home from './pages/Home';
import SkillForm from './pages/SkillForm';
import SkillItem from './pages/SkillItem';
import SkillList from './pages/SkillList';
import './App.css';

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
        <Route path="/skill-create" element={<SkillForm />} />
        <Route path="/skill-item" element={<SkillItem />} />
        <Route path="/skill-list" element={<SkillList />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
