// src/pages/Feed.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { getToken } from "../utils/auth";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  MoreHorizontal,
  Smile,
} from "lucide-react";
import "../css/Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [activeCommentInput, setActiveCommentInput] = useState(null);
  const { currentUser } = useAuth();

  // Sample mock data for fallback
  const mockPosts = [
    {
      id: 1,
      user: {
        id: 101,
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        profilePicture: "https://via.placeholder.com/150",
      },
      content: "Just working on a new project! #coding #webdev",
      imageUrl: "https://via.placeholder.com/600x800",
      likesCount: 120,
      commentsCount: 14,
      liked: false,
      saved: false,
      timestamp: "2023-11-15T14:30:00Z",
      comments: [
        {
          id: 1,
          user: {
            username: "jane_smith",
            profilePicture: "https://via.placeholder.com/150",
          },
          content: "Looks amazing!",
          timestamp: "2023-11-15T14:35:00Z",
        },
      ],
    },
    {
      id: 2,
      user: {
        id: 102,
        username: "janesmith",
        firstName: "Jane",
        lastName: "Smith",
        profilePicture: "https://via.placeholder.com/150",
      },
      content: "Beautiful sunset today 🌅 #nature #evening",
      imageUrl: "https://via.placeholder.com/600x600",
      likesCount: 243,
      commentsCount: 32,
      liked: true,
      saved: true,
      timestamp: "2023-11-15T10:15:00Z",
      comments: [
        {
          id: 2,
          user: {
            username: "john_doe",
            profilePicture: "https://via.placeholder.com/150",
          },
          content: "Wow! Where is this?",
          timestamp: "2023-11-15T10:20:00Z",
        },
        {
          id: 3,
          user: {
            username: "travel_lover",
            profilePicture: "https://via.placeholder.com/150",
          },
          content: "Beautiful colors!",
          timestamp: "2023-11-15T10:45:00Z",
        },
      ],
    },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Check if token exists before making the request
      const token = getToken();
      
      if (!token) {
        console.log("No authentication token found, using mock data");
        setPosts(mockPosts);
        setError(null);
        setLoading(false);
        return;
      }
      
      const response = await axios.get("/posts/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      
      // Check if it's an authentication error
      if (err.response && err.response.status === 403) {
        console.log("Authentication error, using mock data");
        setPosts(mockPosts);
        setError(null);
      } else {
        setError("Failed to load posts. Using sample data instead.");
        setPosts(mockPosts); // Fall back to mock data on any error
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      // For mock data, just update the UI without API call
      if (mockPosts.some(post => post.id === postId)) {
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                liked: !post.liked,
                likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
              };
            }
            return post;
          })
        );
        return;
      }
      
      await axios.post(
        `/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      // Update posts state to reflect the like
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              liked: !post.liked,
              likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Error liking post:", err);
      // Handle the error gracefully - maybe show a temporary notification
    }
  };

  const handleSavePost = async (postId) => {
    try {
      // For mock data, just update the UI without API call
      if (mockPosts.some(post => post.id === postId)) {
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return { ...post, saved: !post.saved };
            }
            return post;
          })
        );
        return;
      }
      
      await axios.post(
        `/posts/${postId}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      // Update posts state to reflect the save
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return { ...post, saved: !post.saved };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!newComment.trim()) return;

    try {
      // For mock data, just update the UI without API call
      if (mockPosts.some(post => post.id === postId)) {
        const newCommentObj = {
          id: Date.now(), // Generate a temporary ID
          user: {
            username: currentUser?.username || "you",
            profilePicture: currentUser?.profilePicture || "https://via.placeholder.com/150",
          },
          content: newComment,
          timestamp: new Date().toISOString(),
        };
        
        setPosts(
          posts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), newCommentObj],
                commentsCount: (post.commentsCount || 0) + 1,
              };
            }
            return post;
          })
        );
        
        setNewComment("");
        setActiveCommentInput(null);
        return;
      }
      
      const response = await axios.post(
        `/posts/${postId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      // Update posts state with the new comment
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), response.data],
              commentsCount: (post.commentsCount || 0) + 1,
            };
          }
          return post;
        })
      );

      setNewComment("");
      setActiveCommentInput(null);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  // Format timestamp into readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="feed-container">
      {/* Display error banner if there is an error but we're showing mock data */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}
      
      {/* Stories row */}
      <div className="stories-container">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="story-item">
            <div className="story-ring">
              <div className="story-ring-inner">
                <div className="story-avatar"></div>
              </div>
            </div>
            <span className="story-username">user{index + 1}</span>
          </div>
        ))}
      </div>

      {/* Posts feed */}
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            {/* Post header */}
            <div className="post-header">
              <div className="post-user">
                <div className="post-avatar">
                  {post.user.profilePicture && (
                    <img
                      src={post.user.profilePicture}
                      alt={`${post.user.username}'s profile`}
                      className="post-avatar-img"
                    />
                  )}
                </div>
                <Link
                  to={`/profile/${post.user.username}`}
                  className="post-username"
                >
                  {post.user.username}
                </Link>
              </div>
              <button className="post-more-button">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post image */}
            {post.imageUrl && (
              <div className="post-image-container">
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="post-image"
                />
              </div>
            )}

            {/* Post actions */}
            <div className="post-actions">
              <div className="post-buttons">
                <div className="post-buttons-left">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`post-button like-button ${
                      post.liked ? "active" : ""
                    }`}
                  >
                    <Heart
                      size={22}
                      fill={post.liked ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={() =>
                      setActiveCommentInput(
                        activeCommentInput === post.id ? null : post.id
                      )
                    }
                    className="post-button comment-button"
                  >
                    <MessageCircle size={22} />
                  </button>
                  <button className="post-button share-button">
                    <Send size={22} />
                  </button>
                </div>
                <button
                  onClick={() => handleSavePost(post.id)}
                  className={`post-button save-button ${
                    post.saved ? "active" : ""
                  }`}
                >
                  <Bookmark
                    size={22}
                    fill={post.saved ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {/* Likes count */}
              <div className="post-likes">{post.likesCount} likes</div>

              {/* Caption */}
              <div className="post-caption">
                <Link
                  to={`/profile/${post.user.username}`}
                  className="post-username"
                >
                  {post.user.username}
                </Link>
                <span> {post.content}</span>
              </div>

              {/* Comments */}
              {post.commentsCount > 0 && (
                <div>
                  <button
                    className="post-comments-link"
                    onClick={() =>
                      setActiveCommentInput(
                        activeCommentInput === post.id ? null : post.id
                      )
                    }
                  >
                    View all {post.commentsCount} comments
                  </button>
                </div>
              )}

              {post.comments && post.comments.length > 0 && (
                <div className="post-comments">
                  {post.comments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className="post-comment">
                      <Link
                        to={`/profile/${comment.user.username}`}
                        className="post-username"
                      >
                        {comment.user.username}
                      </Link>
                      <span> {comment.content}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div className="post-timestamp">
                {formatTimestamp(post.timestamp)}
              </div>

              {/* Comment input */}
              {activeCommentInput === post.id && (
                <div className="post-comment-form">
                  <button className="post-emoji-button">
                    <Smile size={24} />
                  </button>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="post-comment-input"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleCommentSubmit(post.id);
                      }
                    }}
                  />
                  <button
                    disabled={!newComment.trim()}
                    onClick={() => handleCommentSubmit(post.id)}
                    className="post-comment-submit"
                  >
                    Post
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;