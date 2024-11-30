const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  time: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Message', MessageSchema);
