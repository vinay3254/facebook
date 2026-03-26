const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    maxlength: [5000, 'Post content cannot exceed 5000 characters'],
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  imagePublicId: {
    type: String,
    default: '',
  },
  video: {
    type: String,
    default: '',
  },
  videoPublicId: {
    type: String,
    default: '',
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  shares: { type: Number, default: 0 },
  feeling: {
    emoji: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  privacy: {
    type: String,
    enum: ['public', 'friends', 'only me'],
    default: 'friends',
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
