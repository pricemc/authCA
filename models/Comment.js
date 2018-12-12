const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post' 
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'UserProfile'
    },
    message: {
        type: String,
        required: true
    },
    postedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
