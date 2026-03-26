const express = require('express');
const router = express.Router();
const { getFeed, getUserPosts, createPost, updatePost, deletePost, likePost, addComment, deleteComment } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/feed', getFeed);
router.get('/user/:id', getUserPosts);
router.post('/', upload.single('media'), createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like', likePost);
router.post('/:id/comment', addComment);
router.delete('/:id/comment/:commentId', deleteComment);

module.exports = router;
