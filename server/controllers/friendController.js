const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Send friend request
// @route   POST /api/friends/request/:id
const sendFriendRequest = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const currentUserId = req.user._id.toString();
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    // Check if already friends
    if (req.user.friends.some(fId => fId.toString() === targetUserId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Check if request already sent
    if (targetUser.friendRequests.some(r => r.from.toString() === currentUserId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Check if target already sent a request to current user
    if (req.user.friendRequests.some(r => r.from.toString() === targetUserId)) {
      return res.status(400).json({ message: 'This user already sent you a friend request' });
    }

    await User.findByIdAndUpdate(targetUserId, {
      $push: { friendRequests: { from: currentUserId } },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: targetUserId },
    });

    // Create notification
    const notification = await Notification.create({
      recipient: targetUserId,
      sender: currentUserId,
      type: 'friendRequest',
      message: `${req.user.name} sent you a friend request`,
    });

    res.json({ message: 'Friend request sent', notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept friend request
// @route   PUT /api/friends/accept/:id
const acceptFriendRequest = async (req, res, next) => {
  try {
    const senderId = req.params.id;
    const currentUserId = req.user._id.toString();

    // Check if request exists
    const hasRequest = req.user.friendRequests.some(r => r.from.toString() === senderId);
    if (!hasRequest) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }

    // Add each other as friends
    await User.findByIdAndUpdate(currentUserId, {
      $push: { friends: senderId },
      $pull: { friendRequests: { from: senderId } },
    });

    await User.findByIdAndUpdate(senderId, {
      $push: { friends: currentUserId },
      $pull: { sentFriendRequests: currentUserId },
    });

    // Create notification
    await Notification.create({
      recipient: senderId,
      sender: currentUserId,
      type: 'friendAccepted',
      message: `${req.user.name} accepted your friend request`,
    });

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Decline friend request
// @route   DELETE /api/friends/decline/:id
const declineFriendRequest = async (req, res, next) => {
  try {
    const senderId = req.params.id;
    const currentUserId = req.user._id.toString();

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { friendRequests: { from: senderId } },
    });

    await User.findByIdAndUpdate(senderId, {
      $pull: { sentFriendRequests: currentUserId },
    });

    res.json({ message: 'Friend request declined' });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfriend
// @route   DELETE /api/friends/unfriend/:id
const unfriend = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user._id.toString();

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { friends: targetId },
    });

    await User.findByIdAndUpdate(targetId, {
      $pull: { friends: currentUserId },
    });

    res.json({ message: 'Unfriended successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get friend suggestions (friends of friends)
// @route   GET /api/friends/suggestions
const getFriendSuggestions = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id).populate('friends', '_id friends');

    const friendIds = currentUser.friends.map(f => f._id.toString());
    const pendingIds = currentUser.sentFriendRequests.map(id => id.toString());
    const requestFromIds = currentUser.friendRequests.map(r => r.from.toString());

    // Collect friends-of-friends
    const foFMap = new Map();
    for (const friend of currentUser.friends) {
      for (const fof of friend.friends) {
        const fofId = fof.toString();
        if (
          fofId !== req.user._id.toString() &&
          !friendIds.includes(fofId) &&
          !pendingIds.includes(fofId) &&
          !requestFromIds.includes(fofId)
        ) {
          foFMap.set(fofId, (foFMap.get(fofId) || 0) + 1);
        }
      }
    }

    const sortedSuggestions = [...foFMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id);

    const suggestions = await User.find({ _id: { $in: sortedSuggestions } })
      .select('name profilePicture friends');

    const result = suggestions.map(u => ({
      _id: u._id,
      name: u.name,
      profilePicture: u.profilePicture,
      mutualFriends: foFMap.get(u._id.toString()) || 0,
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendFriendRequest, acceptFriendRequest, declineFriendRequest, unfriend, getFriendSuggestions };
