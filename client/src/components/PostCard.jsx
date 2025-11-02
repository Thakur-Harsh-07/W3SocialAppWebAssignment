import { useState } from 'react';
import toast from 'react-hot-toast';
import { postsAPI } from '../services/api';
import './PostCard.css';

const PostCard = ({ post, currentUserId, token, onUpdate }) => {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState(false);

  const isLiked = post.likes?.some((like) => like.user === currentUserId || like.user._id === currentUserId);

  const handleLike = async () => {
    if (!token) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      setLoading(true);
      await postsAPI.likePost(post._id, token);
      const action = isLiked ? 'Unliked' : 'Liked';
      toast.success(`Post ${action.toLowerCase()}!`);
      onUpdate();
    } catch (err) {
      toast.error('Failed to like post');
      console.error('Error liking post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to comment');
      return;
    }
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      await postsAPI.addComment(post._id, token, commentText.trim());
      setCommentText('');
      setExpandedComments(true);
      toast.success('Comment added!');
      onUpdate();
    } catch (err) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAuthorName = () => {
    if (typeof post.author === 'object' && post.author.name) {
      return post.author.name;
    }
    return 'Unknown User';
  };

  const getCommentAuthorName = (comment) => {
    if (typeof comment.user === 'object' && comment.user.name) {
      return comment.user.name;
    }
    return 'Unknown User';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {getAuthorName().charAt(0).toUpperCase()}
          </div>
          <div className="author-info">
            <div className="author-name">{getAuthorName()}</div>
            <div className="post-time">{formatDate(post.createdAt)}</div>
          </div>
        </div>
      </div>

      {post.content && (
        <div className="post-content">
          <p>{post.content}</p>
        </div>
      )}

      {post.image && (
        <div className="post-image-container">
          <img src={post.image} alt="Post" className="post-image" />
        </div>
      )}

      <div className="post-stats">
        <div className="stat-item">
          <span className="stat-icon">❤️</span>
          <span>{post.likes?.length || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💬</span>
          <span>{post.comments?.length || 0}</span>
        </div>
      </div>

      <div className="post-actions">
        <button
          className={`action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loading || !token}
        >
          <span>❤️</span>
          <span>{isLiked ? 'Liked' : 'Like'}</span>
        </button>
        <button
          className="action-button"
          onClick={() => setExpandedComments(!expandedComments)}
        >
          <span>💬</span>
          <span>Comment</span>
        </button>
      </div>

      {expandedComments && (
        <div className="comments-section">
          {post.comments && post.comments.length > 0 && (
            <div className="comments-list">
              {post.comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-author">
                    <div className="comment-avatar">
                      {getCommentAuthorName(comment).charAt(0).toUpperCase()}
                    </div>
                    <div className="comment-content">
                      <div className="comment-author-name">
                        {getCommentAuthorName(comment)}
                      </div>
                      <div className="comment-text">{comment.content}</div>
                      <div className="comment-time">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {token && (
            <form onSubmit={handleComment} className="comment-form">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                disabled={loading}
              />
              <button
                type="submit"
                className="comment-button"
                disabled={loading || !commentText.trim()}
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;

