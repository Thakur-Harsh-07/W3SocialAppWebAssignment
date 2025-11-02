const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

const {
    createPost,
    getAllPosts,
    getPostById,
    getUserPosts,
    deletePost,
    likePost,
    addComment,
  
} = require('../controllers/Post');

// Public routes 
router.get('/', getAllPosts); // Get all posts
router.get('/user/:userId', getUserPosts); // Get posts by user ID (must be before /:postId)
router.get('/:postId', getPostById); // Get single post by ID

// Protected routes 
router.post('/', auth, createPost); // Create a post
router.post('/:postId/like', auth, likePost); // Like/Unlike a post
router.post('/:postId/comment', auth, addComment); // Add a comment

router.delete('/:postId', auth, deletePost); // Delete a post


module.exports = router;

