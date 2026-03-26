const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// @desc    Get all conversations
// @route   GET /api/conversations
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name profilePicture isOnline')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create conversation with a user
// @route   POST /api/conversations
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { userId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] },
    }).populate('participants', 'name profilePicture isOnline');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, userId],
      });
      await conversation.populate('participants', 'name profilePicture isOnline');
    }

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/:conversationId
const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    // Verify user is participant
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const isParticipant = conversation.participants.some(p => p.toString() === req.user._id.toString());
    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name profilePicture');

    // Mark messages as seen
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        receiver: req.user._id,
        seen: false,
      },
      { seen: true }
    );

    res.json(messages.reverse());
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/messages
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId, content } = req.body;

    // Get or create conversation
    let conv;
    if (conversationId) {
      conv = await Conversation.findById(conversationId);
    } else {
      conv = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] },
      });
      if (!conv) {
        conv = await Conversation.create({
          participants: [req.user._id, receiverId],
        });
      }
    }

    if (!conv) return res.status(404).json({ message: 'Conversation not found' });

    const targetReceiverId = receiverId || conv.participants.find(p => p.toString() !== req.user._id.toString());

    const message = await Message.create({
      sender: req.user._id,
      receiver: targetReceiverId,
      conversationId: conv._id,
      content,
    });

    // Update conversation's last message
    conv.lastMessage = message._id;
    conv.updatedAt = new Date();
    await conv.save();

    await message.populate('sender', 'name profilePicture');

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

module.exports = { getConversations, getOrCreateConversation, getMessages, sendMessage };
