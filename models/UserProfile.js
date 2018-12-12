const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserProfileSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  role: {
    type: String,
    enum: ['Worker', 'Super', 'Admin'],
    default: 'Worker'
  }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
