// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-green-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-2">
          <svg width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <circle cx="25" cy="25" r="22" fill="none" stroke="url(#logo-gradient)" strokeWidth="5" />
            <circle cx="25" cy="12" r="5" fill="#4f46e5" />
            <circle cx="15" cy="30" r="5" fill="#6366f1" />
            <circle cx="35" cy="30" r="5" fill="#10b981" />
            <line x1="25" y1="12" x2="15" y2="30" stroke="#6366f1" strokeWidth="2" />
            <line x1="25" y1="12" x2="35" y2="30" stroke="#10b981" strokeWidth="2" />
            <line x1="15" y1="30" x2="35" y2="30" stroke="#8b5cf6" strokeWidth="2" />
          </svg>
          <span className="text-xl font-bold">SkillHub</span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link to="/feed" className="hover:text-green-200 transition">Feed</Link>
          <Link to="/explore" className="hover:text-green-200 transition">Explore</Link>
          <Link to="/messages" className="hover:text-green-200 transition">Messages</Link>
          <Link to="/groups" className="hover:text-green-200 transition">Groups</Link>
          
          {currentUser ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <span>{currentUser.username}</span>
                <img 
                  src={currentUser.profilePicture || "https://via.placeholder.com/40"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</Link>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-x-3">
              <Link to="/login" className="bg-white text-indigo-600 px-4 py-1 rounded hover:bg-gray-100 transition">Login</Link>
              <Link to="/register" className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 pb-3">
          <Link to="/feed" className="block py-2 hover:bg-indigo-700 px-4 rounded">Feed</Link>
          <Link to="/explore" className="block py-2 hover:bg-indigo-700 px-4 rounded">Explore</Link>
          <Link to="/messages" className="block py-2 hover:bg-indigo-700 px-4 rounded">Messages</Link>
          <Link to="/groups" className="block py-2 hover:bg-indigo-700 px-4 rounded">Groups</Link>
          
          {currentUser ? (
            <>
              <Link to="/profile" className="block py-2 hover:bg-indigo-700 px-4 rounded">Profile</Link>
              <Link to="/settings" className="block py-2 hover:bg-indigo-700 px-4 rounded">Settings</Link>
              <button 
                onClick={handleLogout} 
                className="block w-full text-left py-2 hover:bg-indigo-700 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-2 mt-3 px-4">
              <Link to="/login" className="block bg-white text-indigo-600 px-4 py-2 rounded text-center">Login</Link>
              <Link to="/register" className="block bg-green-500 text-white px-4 py-2 rounded text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;