const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.ObjectId, ref: 'UserProfile' },
  message: String,
  postedDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  displayDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
