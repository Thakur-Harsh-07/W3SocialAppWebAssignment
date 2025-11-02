import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import './Feed.css';

const Feed = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'user'

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = viewMode === 'all' 
        ? await postsAPI.getAllPosts()
        : await postsAPI.getUserPosts(user._id);
      
      if (response.success) {
        // Backend returns posts in data property and already sorted by createdAt
        const posts = response.data || [];
        setPosts(posts);
      } else {
        setError('Failed to load posts');
        toast.error('Failed to load posts');
      }
    } catch (err) {
      setError('Error loading posts');
      toast.error('Error loading posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [viewMode]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostUpdated = () => {
    fetchPosts();
  };

  if (loading && posts.length === 0) {
    return (
      <div className="feed-container">
        <div className="feed-loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <header className="feed-header">
        <h1 className="feed-title">Social Feed</h1>
        <div className="feed-header-actions">
          <span className="user-name">{user?.name}</span>
          <button 
            onClick={() => {
              logout();
              toast.success('Logged out successfully');
              navigate('/login');
            }} 
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="feed-content">
        <div className="feed-view-buttons">
          <button 
            className={`view-button ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            All Posts
          </button>
          <button 
            className={`view-button ${viewMode === 'user' ? 'active' : ''}`}
            onClick={() => setViewMode('user')}
          >
            My Posts
          </button>
        </div>
        <CreatePost onPostCreated={handlePostCreated} />

        {error && <div className="error-message">{error}</div>}

        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?._id}
                token={token}
                onUpdate={handlePostUpdated}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;

