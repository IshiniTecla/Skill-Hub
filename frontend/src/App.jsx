import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PostForm from './pages/PostForm';
import PostFeed from './pages/PostFeed';
import Feed from './components/Feed';
import Home from './pages/Home';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        {/* Use '/' for the root route */}
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/view" element={<PostFeed />} />
        <Route path="/post-create" element={<PostForm />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;