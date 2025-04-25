import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostFeed from './pages/PostFeed';
import PostDetail from './pages/PostDetail';
import ManagePost from './pages/ManagePost'; // ✅ make sure this import is correct
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view" element={<PostFeed />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/manage" element={<ManagePost />} />
      </Routes>
    </Router>
  );
}

export default App; // ✅ THIS LINE IS IMPORTANT!
