const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');


const ADMIN_CREDENTIALS = {
  email: 'admin@123.com',
  password: 'admin',
};

const register = async (req, res) => {
  const { name, email, phoneNumber, password, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    if(email === ADMIN_CREDENTIALS.email){
      return res.status(403).json({ error: 'You can not register with Admin credentials' });
    }
    if(password === ADMIN_CREDENTIALS.password){
      return res.status(403).json({ error: 'You can not register with Admin credentials' });
    }

    await newUser.save();
    res.status(201).json({ message: 'Registration successful, awaiting admin approval.' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === ADMIN_CREDENTIALS.email) {
      if (password !== ADMIN_CREDENTIALS.password) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res
        .cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) // 1 day
        .status(200)
        .json({ message: 'Admin logged in successfully', role: 'admin' });
    }

    else {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (user.status === 'requested') {
        return res.status(403).json({ error: 'Account awaiting admin approval' });
      }

      if (user.status === 'declined') {
        return res.status(403).json({ error: 'Account declined by admin' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res
        .cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) // 1 day
        .status(200)
        .json({ message: 'Login successful', role: user.role, id: user._id });
      }
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logout successful' });
};

module.exports = { register, login, logout };