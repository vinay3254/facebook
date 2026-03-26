const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, declineFriendRequest, unfriend, getFriendSuggestions } = require('../controllers/friendController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/suggestions', getFriendSuggestions);
router.post('/request/:id', sendFriendRequest);
router.put('/accept/:id', acceptFriendRequest);
router.delete('/decline/:id', declineFriendRequest);
router.delete('/unfriend/:id', unfriend);

module.exports = router;
