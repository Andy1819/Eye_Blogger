const express = require('express');
const { getUsersByStatus, updateUserStatus } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Fetch users by status
router.get('/users', authMiddleware, getUsersByStatus);

// Accept ya reject krna, patch use karo, only to update ek particular field ko
router.patch('/users/:userId/status', authMiddleware, updateUserStatus);

module.exports = router;
