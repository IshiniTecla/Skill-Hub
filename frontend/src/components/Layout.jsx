// src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  LogOut,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../css/layout.css";
import api from "../api/axios"; // Use your API instance instead of axios directly

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    username: "",
    firstName: "",
    lastName: "",
  });
  const [profileImageError, setProfileImageError] = useState(false);

  // Fetch user profile data from Spring Boot backend
  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser && currentUser.id) {
        try {
          // Get user profile data
          const userResponse = await api.get(`/api/users/${currentUser.id}`);

          if (userResponse.data) {
            const userData = userResponse.data;

            // Set profile picture URL directly - we'll handle errors with onError event
            // Add cache-busting parameter to prevent browser caching of profile images
            setProfileData({
              profilePicture: `${api.defaults.baseURL}/api/users/${
                currentUser.id
              }/profile-image?t=${new Date().getTime()}`,
              username: userData.username || "User",
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
            });

            // Reset any previous errors
            setProfileImageError(false);
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          // Set default profile data on error
          setProfileData({
            profilePicture: null,
            username: currentUser?.username || "User",
            firstName: currentUser?.firstName || "",
            lastName: currentUser?.lastName || "",
          });
          setProfileImageError(true);
        }
      } else {
        // Set hard-coded default profile data when no currentUser
        // This ensures we always have something to display
        setProfileData({
          profilePicture: null,
          username: "User",
          firstName: "",
          lastName: "",
        });
        setProfileImageError(true);
      }
    };

    fetchProfileData();

    // Initialize with default values immediately to avoid blank state
    if (!currentUser) {
      setProfileData({
        profilePicture: null,
        username: "User",
        firstName: "",
        lastName: "",
      });
    }
  }, [currentUser]);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Save preference to localStorage
    localStorage.setItem("sidebarCollapsed", !sidebarCollapsed);
  };

  // Load sidebar preference from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setSidebarCollapsed(savedState === "true");
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close the mobile menu when clicking outside or pressing ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showMobileMenu]);

  // Updated navigation items with Groups after Messages
  const navItems = [
    { path: "/feed", icon: Home, label: "Feed" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/explore", icon: Compass, label: "Explore" },
    { path: "/reels", icon: Film, label: "Reels" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/groups", icon: Users, label: "Groups" },
    { path: "/notifications", icon: Heart, label: "Notifications" },
    { path: "/create", icon: PlusSquare, label: "Create" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const secondaryNavItems = [
    { path: "/saved", icon: Bookmark, label: "Saved" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  // Generate profile avatar component with fallback
  const ProfileAvatar = ({ className = "avatar-image", size = "normal" }) => {
    // If there's a profile picture and no error loading it, show the image
    if (profileData.profilePicture && !profileImageError) {
      return (
        <img
          src={profileData.profilePicture}
          alt={`${profileData.username}'s profile`}
          className={className}
          onError={(e) => {
            // Set error flag so we fall back to initials
            setProfileImageError(true);
            // Prevent infinite error loop
            e.target.onerror = null;
          }}
        />
      );
    } else {
      // If no profile picture or error loading it, show initials
      const getInitials = () => {
        if (profileData.firstName && profileData.firstName.length > 0) {
          return profileData.firstName[0].toUpperCase();
        } else if (profileData.username && profileData.username.length > 0) {
          return profileData.username[0].toUpperCase();
        } else {
          return "U";
        }
      };

      // Ensure we always have valid initials
      const initials = getInitials();

      return (
        <div
          className={`avatar-placeholder ${
            size === "small" ? "avatar-placeholder-small" : ""
          }`}
        >
          {initials}
        </div>
      );
    }
  };

  return (
    <div className="layout-container">
      {/* Desktop Sidebar with collapsible feature */}
      <div className={`sidebar ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <Link to="/feed" className="sidebar-logo-link">
              <svg
                width="32"
                height="32"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
                className="logo-svg"
              >
                <defs>
                  <linearGradient
                    id="logo-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <circle
                  cx="25"
                  cy="25"
                  r="22"
                  fill="none"
                  stroke="url(#logo-gradient)"
                  strokeWidth="5"
                />
                <circle cx="25" cy="12" r="5" fill="#4f46e5" />
                <circle cx="15" cy="30" r="5" fill="#6366f1" />
                <circle cx="35" cy="30" r="5" fill="#10b981" />
                <line
                  x1="25"
                  y1="12"
                  x2="15"
                  y2="30"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
                <line
                  x1="25"
                  y1="12"
                  x2="35"
                  y2="30"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <line
                  x1="15"
                  y1="30"
                  x2="35"
                  y2="30"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                />
              </svg>
              {!sidebarCollapsed && (
                <span className="logo-text">Skill Hub</span>
              )}
            </Link>
          </div>

          {/* Toggle button for sidebar */}
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-list">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  isActive(item.path) ? "nav-item-active" : "nav-item-inactive"
                } ${sidebarCollapsed ? "nav-item-collapsed" : ""}`}
                title={sidebarCollapsed ? item.label : ""}
              >
                <item.icon
                  className={`nav-icon ${
                    isActive(item.path)
                      ? "nav-icon-active"
                      : "nav-icon-inactive"
                  }`}
                  size={20}
                />
                {!sidebarCollapsed && (
                  <span className="nav-text">{item.label}</span>
                )}
              </Link>
            ))}

            <div className="nav-divider"></div>

            {secondaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  isActive(item.path) ? "nav-item-active" : "nav-item-inactive"
                } ${sidebarCollapsed ? "nav-item-collapsed" : ""}`}
                title={sidebarCollapsed ? item.label : ""}
              >
                <item.icon
                  className={`nav-icon ${
                    isActive(item.path)
                      ? "nav-icon-active"
                      : "nav-icon-inactive"
                  }`}
                  size={20}
                />
                {!sidebarCollapsed && (
                  <span className="nav-text">{item.label}</span>
                )}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className={`logout-button ${
                sidebarCollapsed ? "logout-button-collapsed" : ""
              }`}
              title={sidebarCollapsed ? "Logout" : ""}
            >
              <LogOut className="logout-icon" size={20} />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>

        {/* User profile section - always show even if currentUser is null/undefined */}
        {!sidebarCollapsed && (
          <div className="user-profile">
            <Link to="/profile" className="profile-link">
              <div className="avatar-container">
                <ProfileAvatar />
              </div>
              <div className="user-info">
                <p className="username">{profileData.username || "User"}</p>
                <p className="user-fullname">
                  {profileData.firstName} {profileData.lastName}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Mini profile for collapsed sidebar - always show even if currentUser is null/undefined */}
        {sidebarCollapsed && (
          <div className="user-profile-collapsed">
            <Link
              to="/profile"
              className="profile-link-collapsed"
              title={`${profileData.username || "User"}'s Profile`}
            >
              <div className="avatar-container-collapsed">
                <ProfileAvatar size="small" className="avatar-image-small" />
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Top Navigation Bar */}
      <div className="mobile-topbar">
        <Link to="/feed" className="mobile-logo-link">
          <svg
            width="24"
            height="24"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            className="logo-svg"
          >
            <defs>
              <linearGradient
                id="mobile-logo-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <circle
              cx="25"
              cy="25"
              r="22"
              fill="none"
              stroke="url(#mobile-logo-gradient)"
              strokeWidth="5"
            />
            <circle cx="25" cy="12" r="5" fill="#4f46e5" />
            <circle cx="15" cy="30" r="5" fill="#6366f1" />
            <circle cx="35" cy="30" r="5" fill="#10b981" />
            <line
              x1="25"
              y1="12"
              x2="15"
              y2="30"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <line
              x1="25"
              y1="12"
              x2="35"
              y2="30"
              stroke="#10b981"
              strokeWidth="2"
            />
            <line
              x1="15"
              y1="30"
              x2="35"
              y2="30"
              stroke="#8b5cf6"
              strokeWidth="2"
            />
          </svg>
          <span className="logo-text">Skill Hub</span>
        </Link>

        <div className="mobile-action-buttons">
          <Link to="/messages" className="mobile-icon-button">
            <MessageCircle size={22} />
          </Link>
          <Link to="/groups" className="mobile-icon-button">
            <Users size={22} />
          </Link>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="mobile-icon-button"
          >
            {showMobileMenu ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
        <div
          className="mobile-menu-overlay"
          onClick={() => setShowMobileMenu(false)}
        >
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              {currentUser && (
                <Link
                  to="/profile"
                  className="profile-link"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="avatar-container">
                    <ProfileAvatar />
                  </div>
                  <div className="user-info">
                    <p className="username">{profileData.username || "User"}</p>
                    <p className="user-fullname">
                      {profileData.firstName} {profileData.lastName}
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
                  className={`nav-item ${
                    isActive(item.path)
                      ? "nav-item-active"
                      : "nav-item-inactive"
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon
                    className={`nav-icon ${
                      isActive(item.path)
                        ? "nav-icon-active"
                        : "nav-icon-inactive"
                    }`}
                    size={20}
                  />
                  <span className="nav-text">{item.label}</span>
                </Link>
              ))}

              <div className="nav-divider"></div>

              {secondaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${
                    isActive(item.path)
                      ? "nav-item-active"
                      : "nav-item-inactive"
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon
                    className={`nav-icon ${
                      isActive(item.path)
                        ? "nav-icon-active"
                        : "nav-icon-inactive"
                    }`}
                    size={20}
                  />
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
        <Link
          to="/feed"
          className={`bottom-nav-item ${
            isActive("/feed") ? "bottom-nav-item-active" : ""
          }`}
        >
          <Home className="bottom-nav-icon" size={22} />
          <span className="bottom-nav-label">Feed</span>
        </Link>
        <Link
          to="/search"
          className={`bottom-nav-item ${
            isActive("/search") ? "bottom-nav-item-active" : ""
          }`}
        >
          <Search className="bottom-nav-icon" size={22} />
          <span className="bottom-nav-label">Search</span>
        </Link>
        <Link
          to="/messages"
          className={`bottom-nav-item ${
            isActive("/messages") ? "bottom-nav-item-active" : ""
          }`}
        >
          <MessageCircle className="bottom-nav-icon" size={22} />
          <span className="bottom-nav-label">Messages</span>
        </Link>
        <Link
          to="/groups"
          className={`bottom-nav-item ${
            isActive("/groups") ? "bottom-nav-item-active" : ""
          }`}
        >
          <Users className="bottom-nav-icon" size={22} />
          <span className="bottom-nav-label">Groups</span>
        </Link>
        <Link
          to="/profile"
          className={`bottom-nav-item ${
            isActive("/profile") ? "bottom-nav-item-active" : ""
          }`}
        >
          <User className="bottom-nav-icon" size={22} />
          <span className="bottom-nav-label">Profile</span>
        </Link>
      </div>

      {/* Main Content - Adjust to accommodate collapsed sidebar */}
      <div
        className={`main-content ${
          sidebarCollapsed ? "main-content-expanded" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
