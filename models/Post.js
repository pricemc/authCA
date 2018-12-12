const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserProfile'
  },
  message: {
    type: String,
    required: true
  },
  postedDate: { type: Date, default: Date.now },
  children: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  }]
});

module.exports = mongoose.model('Post', PostSchema);
