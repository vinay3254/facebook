const express = require('express');
const router = express.Router();
const { getUser, updateUser, searchUsers, getUserFriends, getFriendRequests } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/search', searchUsers);
router.get('/friend-requests', getFriendRequests);
router.get('/:id', getUser);
router.put('/:id', upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 },
]), updateUser);
router.get('/:id/friends', getUserFriends);

module.exports = router;
