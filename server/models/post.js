const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String, // URL to image if uploaded
        default: null
    },
    likes: [likeSchema],
    comments: [commentSchema]
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);

