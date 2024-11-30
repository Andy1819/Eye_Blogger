const User = require('../models/User');

// Fetch users by status
const getUsersByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const users = await User.find({ status });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Update user status (accept/reject)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error });
  }
};

module.exports = { getUsersByStatus, updateUserStatus };
