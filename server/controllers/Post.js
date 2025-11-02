const Post = require('../models/post');
const User = require('../models/user');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        const userId = req.user.id;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Post content is required"
            });
        }

        const post = await Post.create({
            author: userId,
            content: content.trim(),
            image: image || null
        });

        // Populate author details
        await post.populate('author', 'name email');

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error creating post",
            error: error.message
        });
    }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email')
            .populate('likes.user', 'name email')
            .populate('comments.user', 'name email')
            .sort({ createdAt: -1 }); // Latest posts first

        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            count: posts.length,
            data: posts
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching posts",
            error: error.message
        });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId)
            .populate('author', 'name email')
            .populate('likes.user', 'name email')
            .populate('comments.user', 'name email');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching post",
            error: error.message
        });
    }
};

// Get posts by a specific user
exports.getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await Post.find({ author: userId })
            .populate('author', 'name email')
            .populate('likes.user', 'name email')
            .populate('comments.user', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "User posts fetched successfully",
            count: posts.length,
            data: posts
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user posts",
            error: error.message
        });
    }
};

// Delete a post (only by author)
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user is the author
        if (post.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post"
            });
        }

        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error deleting post",
            error: error.message
        });
    }
};

// Like/Unlike a post
exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user already liked the post
        const existingLikeIndex = post.likes.findIndex(
            like => like.user.toString() === userId
        );

        if (existingLikeIndex > -1) {
            // Unlike: Remove the like
            post.likes.splice(existingLikeIndex, 1);
            await post.save();
            
            await post.populate('author', 'name email');
            await post.populate('likes.user', 'name email');
            await post.populate('comments.user', 'name email');

            return res.status(200).json({
                success: true,
                message: "Post unliked successfully",
                data: post
            });
        } else {
            // Like: Add the like
            post.likes.push({ user: userId });
            await post.save();
            
            await post.populate('author', 'name email');
            await post.populate('likes.user', 'name email');
            await post.populate('comments.user', 'name email');

            return res.status(200).json({
                success: true,
                message: "Post liked successfully",
                data: post
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error liking/unliking post",
            error: error.message
        });
    }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Add comment
        post.comments.push({
            user: userId,
            content: content.trim()
        });

        await post.save();
        await post.populate('author', 'name email');
        await post.populate('likes.user', 'name email');
        await post.populate('comments.user', 'name email');

        // Get the last comment (the one we just added)
        const newComment = post.comments[post.comments.length - 1];

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: {
                post: post,
                comment: newComment
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error adding comment",
            error: error.message
        });
    }
};


