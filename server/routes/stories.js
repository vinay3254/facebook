const express = require('express');
const router = express.Router();
const { getStories, createStory, viewStory, deleteStory } = require('../controllers/storyController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/', getStories);
router.post('/', upload.single('image'), createStory);
router.put('/:id/view', viewStory);
router.delete('/:id', deleteStory);

module.exports = router;
