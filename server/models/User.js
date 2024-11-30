const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
    
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
    
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: 10, 
    maxlength: 10 
    
  },
  password: { 
    type: String, 
    required: true 
    
  },
  role: { 
    type: String, 
    enum: ['editor', 'viewer'], 
    required: true 
    
  },
  status: { 
    type: String, 
    enum: ['requested', 'accepted', 'declined'], 
    default: 'requested' 
    
  },
});

module.exports = mongoose.model('User', UserSchema);
