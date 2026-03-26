const express = require('express');
const router = express.Router();
const { getConversations, getOrCreateConversation } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getConversations);
router.post('/', getOrCreateConversation);

module.exports = router;
