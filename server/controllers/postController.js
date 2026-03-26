const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const cloudinary = require('../utils/cloudinary');

// @desc    Get news feed
// @route   GET /api/posts/feed
const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const friendIds = req.user.friends;
    const authorIds = [req.user._id, ...friendIds];

    const posts = await Post.find({ author: { $in: authorIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name profilePicture')
      .populate('comments.author', 'name profilePicture');

    const total = await Post.countDocuments({ author: { $in: authorIds } });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:id
const getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const isFriend = req.user.friends.some(fId => fId.toString() === req.params.id);
    const isOwner = req.user._id.toString() === req.params.id;

    const privacyFilter = isOwner
      ? {}
      : isFriend
      ? { privacy: { $in: ['public', 'friends'] } }
      : { privacy: 'public' };

    const posts = await Post.find({ author: req.params.id, ...privacyFilter })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name profilePicture')
      .populate('comments.author', 'name profilePicture');

    const total = await Post.countDocuments({ author: req.params.id, ...privacyFilter });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create post
// @route   POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { content, privacy, feelingEmoji, feelingLabel } = req.body;

    if (!content && !req.file) {
      return res.status(400).json({ message: 'Post must have content, image, or video' });
    }

    const postData = {
      author: req.user._id,
      content: content || '',
      privacy: privacy || 'friends',
      feeling: {
        emoji: feelingEmoji || '',
        label: feelingLabel || '',
      },
    };

    if (req.file) {
      if (req.file.mimetype.startsWith('video/')) {
        postData.video = req.file.path;
        postData.videoPublicId = req.file.filename;
      } else {
        postData.image = req.file.path;
        postData.imagePublicId = req.file.filename;
      }
    }

    const post = await Post.create(postData);
    await post.populate('author', 'name profilePicture');

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { content, privacy } = req.body;
    if (content !== undefined) post.content = content;
    if (privacy) post.privacy = privacy;

    const updated = await post.save();
    await updated.populate('author', 'name profilePicture');
    await updated.populate('comments.author', 'name profilePicture');

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete media from cloudinary
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }
    if (post.videoPublicId) {
      await cloudinary.uploader.destroy(post.videoPublicId, { resource_type: 'video' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id.toString();
    const isLiked = post.likes.some(id => id.toString() === userId);

    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
      // Notify post author
      if (post.author.toString() !== userId) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'like',
          postId: post._id,
          message: `${req.user.name} liked your post`,
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes, isLiked: !isLiked });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment
// @route   POST /api/posts/:id/comment
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      author: req.user._id,
      content,
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('comments.author', 'name profilePicture');

    const newComment = post.comments[post.comments.length - 1];

    // Notify post author
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        postId: post._id,
        message: `${req.user.name} commented on your post`,
      });
    }

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comment/:commentId
const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isCommentAuthor = comment.author.toString() === req.user._id.toString();
    const isPostAuthor = post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFeed, getUserPosts, createPost, updatePost, deletePost, likePost, addComment, deleteComment };
