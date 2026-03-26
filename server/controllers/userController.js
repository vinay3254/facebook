const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/:id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .populate('friends', 'name profilePicture');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check friendship status with requesting user
    const currentUserId = req.user._id.toString();
    const targetUserId = user._id.toString();

    let friendshipStatus = 'none';
    if (user.friends.some(f => f._id.toString() === currentUserId)) {
      friendshipStatus = 'friends';
    } else if (user.friendRequests.some(r => r.from.toString() === currentUserId)) {
      friendshipStatus = 'pending_sent';
    } else if (req.user.friendRequests.some(r => r.from.toString() === targetUserId)) {
      friendshipStatus = 'pending_received';
    }

    res.json({ ...user.toObject(), friendshipStatus });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { name, bio, hometown, workplace, relationshipStatus, gender, dateOfBirth } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (hometown !== undefined) updateData.hometown = hometown;
    if (workplace !== undefined) updateData.workplace = workplace;
    if (relationshipStatus !== undefined) updateData.relationshipStatus = relationshipStatus;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    // Handle profile picture upload
    if (req.files?.profilePicture) {
      updateData.profilePicture = req.files.profilePicture[0].path;
    }
    if (req.files?.coverPhoto) {
      updateData.coverPhoto = req.files.coverPhoto[0].path;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password').populate('friends', 'name profilePicture');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/users/search?q=name
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      name: { $regex: q, $options: 'i' },
      _id: { $ne: req.user._id },
    })
      .select('name profilePicture friends')
      .limit(20);

    // Add mutual friends count
    const results = users.map(user => {
      const mutualFriends = user.friends.filter(fId =>
        req.user.friends.some(myFId => myFId.toString() === fId.toString())
      ).length;
      return {
        _id: user._id,
        name: user.name,
        profilePicture: user.profilePicture,
        mutualFriends,
      };
    });

    res.json(results);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's friends
// @route   GET /api/users/:id/friends
const getUserFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('friends', 'name profilePicture bio');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.friends);
  } catch (error) {
    next(error);
  }
};

// @desc    Get friend requests for current user
// @route   GET /api/users/friend-requests
const getFriendRequests = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friendRequests.from', 'name profilePicture friends');
    res.json(user.friendRequests);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, updateUser, searchUsers, getUserFriends, getFriendRequests };
