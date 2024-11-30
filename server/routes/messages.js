const express = require('express');
const { getAllMessages, createMessage, deleteMessage, editMessage } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getAllMessages);
router.post('/create', authMiddleware, createMessage);
router.put('/:id', authMiddleware, editMessage);
router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
