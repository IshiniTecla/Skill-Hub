// src/components/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User, 
  MessageCircle, 
  Compass, 
  Film, 
  Bookmark, 
  Settings,
  LogOut
} from 'lucide-react';
import '../css/layout.css';

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close the mobile menu when clicking outside or pressing ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showMobileMenu]);

  const navItems = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/reels', icon: Film, label: 'Reels' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/notifications', icon: Heart, label: 'Notifications' },
    { path: '/create', icon: PlusSquare, label: 'Create' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const secondaryNavItems = [
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="layout-container">
      {/* Desktop Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo-container">
          <Link to="/feed" className="sidebar-logo-link">
            <svg width="32" height="32" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
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
            <span className="logo-text">Skill Hub</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-list">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <item.icon className={`nav-icon ${isActive(item.path) ? 'nav-icon-active' : 'nav-icon-inactive'}`} size={20} />
                <span className="nav-text">{item.label}</span>
              </Link>
            ))}

            <div className="nav-divider"></div>
            
            {secondaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'nav-item-active' : 'nav-item-inactive'}`}
              >
                <item.icon className={`nav-icon ${isActive(item.path) ? 'nav-icon-active' : 'nav-icon-inactive'}`} size={20} />
                <span className="nav-text">{item.label}</span>
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <LogOut className="logout-icon" size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {currentUser && (
          <div className="user-profile">
            <Link to="/profile" className="profile-link">
              <div className="avatar-container">
                {currentUser.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt={`${currentUser.username}'s profile`}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {currentUser.firstName && currentUser.firstName[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <p className="username">{currentUser.username}</p>
                <p className="user-fullname">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Top Navigation Bar */}
      <div className="mobile-topbar">
        <Link to="/feed" className="mobile-logo-link">
          <svg width="24" height="24" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
            <defs>
              <linearGradient id="mobile-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <circle cx="25" cy="25" r="22" fill="none" stroke="url(#mobile-logo-gradient)" strokeWidth="5" />
            <circle cx="25" cy="12" r="5" fill="#4f46e5" />
            <circle cx="15" cy="30" r="5" fill="#6366f1" />
            <circle cx="35" cy="30" r="5" fill="#10b981" />
            <line x1="25" y1="12" x2="15" y2="30" stroke="#6366f1" strokeWidth="2" />
            <line x1="25" y1="12" x2="35" y2="30" stroke="#10b981" strokeWidth="2" />
            <line x1="15" y1="30" x2="35" y2="30" stroke="#8b5cf6" strokeWidth="2" />
          </svg>
          <span className="logo-text">Skill Hub</span>
        </Link>
        
        <div className="mobile-action-buttons">
          <Link to="/messages" className="mobile-icon-button">
            <MessageCircle size={22} />
          </Link>
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="mobile-icon-button">
            {showMobileMenu ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              {currentUser && (
                <Link to="/profile" className="profile-link" onClick={() => setShowMobileMenu(false)}>
                  <div className="avatar-container">
                    {currentUser.profilePicture ? (
                      <img 
                        src={currentUser.profilePicture} 
                        alt={`${currentUser.username}'s profile`}
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {currentUser.firstName && currentUser.firstName[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="user-info">
                    <p className="username">{currentUser.username}</p>
                    <p className="user-fullname">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                  </div>
                </Link>
              )}
            </div>
            
            <nav className="nav-list">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'nav-item-active' : 'nav-item-inactive'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon className={`nav-icon ${isActive(item.path) ? 'nav-icon-active' : 'nav-icon-inactive'}`} size={20} />
                  <span className="nav-text">{item.label}</span>
                </Link>
              ))}
              
              <div className="nav-divider"></div>
              
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'nav-item-active' : 'nav-item-inactive'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon className={`nav-icon ${isActive(item.path) ? 'nav-icon-active' : 'nav-icon-inactive'}`} size={20} />
                  <span className="nav-text">{item.label}</span>
                </Link>
              ))}
              
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="logout-button"
              >
                <LogOut className="logout-icon" size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive(item.path) ? 'bottom-nav-item-active' : ''}`}
          >
            <item.icon className="bottom-nav-icon" size={22} />
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;