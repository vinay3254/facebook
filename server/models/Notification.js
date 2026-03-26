const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'friendRequest', 'friendAccepted', 'share'],
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
