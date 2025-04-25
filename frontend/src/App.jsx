// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostFeed from './pages/PostFeed';
import PostDetail from './pages/PostDetail';
import ManagePost from './pages/ManagePost';
import EditPost from './pages/EditPost';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view" element={<PostFeed />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/manage" element={<ManagePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;
