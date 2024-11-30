const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { validateContact } = require('../middlewares/checkUser');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes for authentication
router.post('/register', validateContact, register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
