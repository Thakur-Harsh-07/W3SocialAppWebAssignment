import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const { token } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      const errorMsg = 'Please enter post content';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creating post...');

    try {
      const response = await postsAPI.createPost(
        token,
        content.trim() || null,
        image.trim() || null
      );

      if (response.success) {
        setContent('');
        setImage('');
        toast.success('Post created successfully!', { id: toastId });
        onPostCreated();
      } else {
        const errorMsg = response.message || 'Failed to create post';
        setError(errorMsg);
        toast.error(errorMsg, { id: toastId });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error creating post';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-card">
      <h2 className="create-post-title">Create a Post</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows="4"
            className="post-textarea"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL (optional)"
            className="post-input"
          />
        </div>

        <div className="post-preview">
          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" onError={(e) => {
                e.target.style.display = 'none';
              }} />
            </div>
          )}
        </div>

        <button type="submit" className="post-button" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

