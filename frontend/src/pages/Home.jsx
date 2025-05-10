
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Adding icons for visual appeal

const Home = () => {
    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <div style={styles.content}>
                <h1 style={styles.heading}>Welcome to SkillHub</h1>
                <p style={styles.subheading}>Learn, Share, and Grow with Others</p>

                <div style={styles.description}>
                    <p style={styles.infoText}>Join a community of learners and experts. Gain new skills, connect with peers, and start your learning journey today!</p>
                </div>

                <div style={styles.buttonsContainer}>
                    <Link to="/signin" style={styles.link}>
                        <button style={styles.button}>
                            <FaSignInAlt style={styles.icon} /> Sign In
                        </button>
                    </Link>

                    <Link to="/signup" style={styles.link}>
                        <button style={styles.button}>
                            <FaUserPlus style={styles.icon} /> Sign Up
                        </button>
                    </Link>
                </div>

                <div style={styles.exploreSection}>
                    <p style={styles.exploreText}>Explore our platform and start learning today!</p>
                    <Link to="/explore" style={styles.link}>
                        <button style={styles.exploreButton}>Explore Now</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
        backgroundImage: 'url("https://your-image-url-here.jpg")', // Add a background image URL here
        backgroundSize: 'cover', // Cover the entire container
        backgroundPosition: 'center center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)', // Darker overlay to make text stand out
        zIndex: 0,
    },
    content: {
        textAlign: 'center',
        padding: '30px',
        backgroundColor: 'rgba(41, 34, 34, 0.8)', // Semi-transparent background
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        maxWidth: '600px',
        zIndex: 1,
    },
    heading: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#fff', // White text for contrast
        marginBottom: '10px',
    },
    subheading: {
        fontSize: '1.2rem',
        color: '#fff', // White text for contrast
        marginBottom: '20px',
        fontWeight: '500',
    },
    description: {
        marginBottom: '30px',
    },
    infoText: {
        fontSize: '1rem',
        color: '#ddd', // Light grey text
        maxWidth: '500px',
        margin: '0 auto',
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '20px',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '15px 30px',
        fontSize: '1rem',
        borderRadius: '5px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    icon: {
        marginRight: '8px',
    },
    link: {
        textDecoration: 'none',
    },
    exploreSection: {
        marginTop: '20px',
    },
    exploreText: {
        fontSize: '1.1rem',
        color: '#fff',
        fontWeight: '600',
    },
    exploreButton: {
        padding: '15px 25px',
        fontSize: '1rem',
        borderRadius: '5px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default Home;

import { useState } from 'react';
import { Search, Bell, MessageCircle, User, Book, Share2, Heart, MessageSquare, ChevronDown, Globe, Briefcase, Music } from 'lucide-react';

// Simulated React Router functionality
const Link = ({ to, className, children }) => (
  <a href={to} className={className}>{children}</a>
);

// Logo component
const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
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
);

// HomePage Component
const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-header">
        <div className="home-logo-container">
          <Logo />
        </div>
        
        <h1 className="home-title">
          <span className="home-title-gradient">
            SkillSwap
          </span>
        </h1>
        
        <p className="home-description">
          Connect with others, share your expertise, and learn new skills in our 
          educational community platform.
        </p>

        <div className="home-buttons">
          <Link
            to="/register"
            className="home-button-primary"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="home-button-secondary"
          >
            Log In
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="home-hero-container">
        <div className="home-hero-image-wrapper">
          <img 
            src="/api/placeholder/1200/600" 
            alt="People collaborating and learning together" 
            className="home-hero-image"
          />
          <div className="home-hero-overlay"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="home-features-section">
        <h2 className="home-section-title">How SkillSwap Works</h2>
        
        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon-wrapper">
              <Globe className="home-feature-icon" size={30} />
            </div>
            <h3 className="home-feature-title">Connect</h3>
            <p className="home-feature-description">Find people with complementary skills and build your learning network.</p>
          </div>
          
          <div className="home-feature-card">
            <div className="home-feature-icon-wrapper">
              <Share2 className="home-feature-icon" size={30} />
            </div>
            <h3 className="home-feature-title">Share</h3>
            <p className="home-feature-description">Offer your knowledge and expertise to help others grow their skills.</p>
          </div>
          
          <div className="home-feature-card">
            <div className="home-feature-icon-wrapper">
              <Book className="home-feature-icon" size={30} />
            </div>
            <h3 className="home-feature-title">Learn</h3>
            <p className="home-feature-description">Acquire new skills from experts in various fields and disciplines.</p>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="home-categories-section">
        <h2 className="home-section-title">Popular Skill Categories</h2>
        
        <div className="home-categories-grid">
          <div className="home-category-card">
            <img src="/api/placeholder/300/200" alt="Technology category" className="home-category-image" />
            <div className="home-category-overlay">
              <div>
                <div className="home-category-title">Technology</div>
                <div className="home-category-subtitle">Programming, Web Dev, AI</div>
              </div>
            </div>
          </div>
          
          <div className="home-category-card">
            <img src="/api/placeholder/300/200" alt="Languages category" className="home-category-image" />
            <div className="home-category-overlay home-category-overlay-green">
              <div>
                <div className="home-category-title">Languages</div>
                <div className="home-category-subtitle home-category-subtitle-green">English, Spanish, Mandarin</div>
              </div>
            </div>
          </div>
          
          <div className="home-category-card">
            <img src="/api/placeholder/300/200" alt="Arts category" className="home-category-image" />
            <div className="home-category-overlay home-category-overlay-purple">
              <div>
                <div className="home-category-title">Arts</div>
                <div className="home-category-subtitle home-category-subtitle-purple">Drawing, Photography, Design</div>
              </div>
            </div>
          </div>
          
          <div className="home-category-card">
            <img src="/api/placeholder/300/200" alt="Business category" className="home-category-image" />
            <div className="home-category-overlay home-category-overlay-blue">
              <div>
                <div className="home-category-title">Business</div>
                <div className="home-category-subtitle home-category-subtitle-blue">Marketing, Finance, Leadership</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="home-testimonials-section">
        <h2 className="home-section-title">What Our Community Says</h2>
        
        <div className="home-testimonials-grid">
          <div className="home-testimonial-card">
            <div className="home-testimonial-header">
              <div className="home-testimonial-avatar-wrapper">
                <img src="/api/placeholder/48/48" alt="User testimonial" className="home-testimonial-avatar" />
              </div>
              <div>
                <h4 className="home-testimonial-name">Sarah Johnson</h4>
                <p className="home-testimonial-role">Graphic Designer</p>
              </div>
            </div>
            <p className="home-testimonial-text">"SkillSwap helped me learn coding while I taught design. It's such a fair exchange of knowledge!"</p>
          </div>
          
          <div className="home-testimonial-card">
            <div className="home-testimonial-header">
              <div className="home-testimonial-avatar-wrapper">
                <img src="/api/placeholder/48/48" alt="User testimonial" className="home-testimonial-avatar" />
              </div>
              <div>
                <h4 className="home-testimonial-name">Michael Lee</h4>
                <p className="home-testimonial-role">Software Developer</p>
              </div>
            </div>
            <p className="home-testimonial-text">"I've expanded my network and learned Spanish while teaching programming. This platform is amazing!"</p>
          </div>
          
          <div className="home-testimonial-card">
            <div className="home-testimonial-header">
              <div className="home-testimonial-avatar-wrapper">
                <img src="/api/placeholder/48/48" alt="User testimonial" className="home-testimonial-avatar" />
              </div>
              <div>
                <h4 className="home-testimonial-name">Priya Sharma</h4>
                <p className="home-testimonial-role">Language Teacher</p>
              </div>
            </div>
            <p className="home-testimonial-text">"The community here is supportive and engaged. I've made friends while expanding my professional skills."</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="home-cta-section">
        <div className="home-cta-container">
          <h2 className="home-cta-title">Ready to start your skill-sharing journey?</h2>
          <p className="home-cta-description">Join thousands of people who are already connecting, sharing, and learning together.</p>
          <Link
            to="/register"
            className="home-cta-button"
          >
            Get Started for Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-container">
          <div className="home-footer-top">
            <div className="home-footer-branding">
              <div className="home-footer-logo">
                <Logo />
                <span className="home-footer-logo-text">SkillSwap</span>
              </div>
              <p className="home-footer-tagline">Connecting people through education and skill sharing since 2025.</p>
            </div>
            
            <div className="home-footer-links-grid">
              <div className="home-footer-links-column">
                <h4 className="home-footer-heading">Platform</h4>
                <ul className="home-footer-links-list">
                  <li><a href="#" className="home-footer-link">How it Works</a></li>
                  <li><a href="#" className="home-footer-link">Categories</a></li>
                  <li><a href="#" className="home-footer-link">Community Guidelines</a></li>
                </ul>
              </div>
              
              <div className="home-footer-links-column">
                <h4 className="home-footer-heading">Company</h4>
                <ul className="home-footer-links-list">
                  <li><a href="#" className="home-footer-link">About Us</a></li>
                  <li><a href="#" className="home-footer-link">Careers</a></li>
                  <li><a href="#" className="home-footer-link">Contact</a></li>
                </ul>
              </div>
              
              <div className="home-footer-links-column">
                <h4 className="home-footer-heading">Legal</h4>
                <ul className="home-footer-links-list">
                  <li><a href="#" className="home-footer-link">Privacy Policy</a></li>
                  <li><a href="#" className="home-footer-link">Terms of Service</a></li>
                  <li><a href="#" className="home-footer-link">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="home-footer-bottom">
            <p className="home-footer-copyright">© 2025 SkillSwap. All rights reserved.</p>
            <div className="home-footer-social">
              <a href="#" className="home-footer-social-link">
                <span className="sr-only">Facebook</span>
                <svg className="home-footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="home-footer-social-link">
                <span className="sr-only">Instagram</span>
                <svg className="home-footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              <a href="#" className="home-footer-social-link">
                <span className="sr-only">Twitter</span>
                <svg className="home-footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="home-footer-social-link">
                <span className="sr-only">GitHub</span>
                <svg className="home-footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

