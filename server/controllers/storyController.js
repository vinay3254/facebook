const Story = require('../models/Story');
const cloudinary = require('../utils/cloudinary');

// GET /api/stories — get stories from self + friends, grouped by author
const getStories = async (req, res, next) => {
  try {
    const authorIds = [req.user._id, ...req.user.friends];

    const stories = await Story.find({
      author: { $in: authorIds },
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePicture');

    // Group by author, own stories first
    const map = {};
    stories.forEach(story => {
      const id = story.author._id.toString();
      if (!map[id]) map[id] = { author: story.author, stories: [] };
      map[id].stories.push(story);
    });

    const grouped = Object.values(map).sort((a, b) => {
      if (a.author._id.toString() === req.user._id.toString()) return -1;
      if (b.author._id.toString() === req.user._id.toString()) return 1;
      return 0;
    });

    res.json(grouped);
  } catch (error) {
    next(error);
  }
};

// POST /api/stories — create a story
const createStory = async (req, res, next) => {
  try {
    const { text, backgroundColor } = req.body;

    if (!text && !req.file) {
      return res.status(400).json({ message: 'Story must have an image or text' });
    }

    const storyData = {
      author: req.user._id,
      text: text || '',
      backgroundColor: backgroundColor || '#1877F2',
    };

    if (req.file) {
      storyData.image = req.file.path;
      storyData.imagePublicId = req.file.filename;
    }

    const story = await Story.create(storyData);
    await story.populate('author', 'name profilePicture');

    res.status(201).json(story);
  } catch (error) {
    next(error);
  }
};

// PUT /api/stories/:id/view — mark story as viewed
const viewStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const userId = req.user._id.toString();
    if (!story.viewers.some(v => v.toString() === userId)) {
      story.viewers.push(req.user._id);
      await story.save();
    }

    res.json({ message: 'Viewed' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/stories/:id
const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (story.imagePublicId) {
      await cloudinary.uploader.destroy(story.imagePublicId);
    }

    await story.deleteOne();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStories, createStory, viewStory, deleteStory };
