const Message = require('../models/Message');

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('user', 'name').sort({ time: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages', details: error.message });
  }
};

const createMessage = async (req, res) => {
  const { content } = req.body;
  const userId = req.user;

  try {
    const newMessage = new Message({ content, user: userId });
    await newMessage.save();
    res.status(201).json({ message: 'Message created successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Error creating message', details: error.message });
  }
};

const editMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.content = content;
    await message.save();

    res.status(200).json({ message: 'Message updated successfully', data: message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message', details: error.message });
  }
};


const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.user.toString() !== req.user) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    await Message.findByIdAndDelete(id);

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message', details: error.message });
  }
};


module.exports = { getAllMessages, createMessage, editMessage, deleteMessage };
