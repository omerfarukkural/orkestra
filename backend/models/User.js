const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  settings: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true },
    autoSync: { type: Boolean, default: true }
  }
});

module.exports = mongoose.model('User', userSchema);
