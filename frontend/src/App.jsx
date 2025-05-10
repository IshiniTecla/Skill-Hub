
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import SkillFormCard from './pages/SkillFormCard';
import './App.css';
import SkillCard from './pages/SkillCard';
import SkillEditCard from './pages/SkillEditCard';
import SkillEndorseCard from './pages/SkillEndorseCard';
import EndorseSkillForm from "./pages/EndorseSkillForm";
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Use '/' for the root route */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />

        <Route path="/skills/add" element={<SkillFormCard />} />
        <Route path="/skill-card" element={<SkillCard />} />
        <Route path="/skill-endorsecard" element={<SkillEndorseCard />} />
        <Route path="/skills/edit/:id" element={<SkillEditCard />} />
        <Route path="/endorse/:skillId" element={<EndorseSkillForm />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

import React, { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";

// Loading Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lazy load components for better performance
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Feed = lazy(() => import("./pages/Feed"));
const Profile = lazy(() => import("./pages/profilepage"));
const Groups = lazy(() => import("./pages/Group/Groups"));
const GroupCreate = lazy(() => import("./pages/Group/GroupCreate"));
const GroupDetail = lazy(() => import("./pages/Group/GroupDetail"));
const GroupManage = lazy(() => import("./pages/Group/GroupManage")); // Corrected import
const Messages = lazy(() => import("./pages/Messages"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Explore = lazy(() => import("./pages/Explore"));
const Search = lazy(() => import("./pages/Search"));
const Reels = lazy(() => import("./pages/Reels"));
const Settings = lazy(() => import("./pages/Settings"));
const Saved = lazy(() => import("./pages/Saved"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CreatePost = lazy(() => import("./pages/CreatePost"));

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Routes only accessible when NOT logged in
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (currentUser) {
    return <Navigate to="/feed" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              }
            />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected routes with Layout */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Feed />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/:username"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Group routes */}
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Groups />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/groups/create"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GroupCreate />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/groups/:groupId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GroupDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/groups/:groupId/manage"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GroupManage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Messages />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Explore />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Search />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reels"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Reels />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Saved />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreatePost />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>

    </Router>
  );
}


export default App;

export default App;

